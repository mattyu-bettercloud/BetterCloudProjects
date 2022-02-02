const axios = require('axios');
let secrets;
let authKey;
let errorCallback;

const getInsightUserId = async (email) => {
    const getUserRequest = {
        method: "GET",
        url: `https://${secrets.insightRegion}.api.insight.rapid7.com/account/api/1/users?email=${email}`,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-api-key': authKey
        }
    };
    try {
        const response = await axios(getUserRequest);
        const users = response.data,
            matchingUser = users.find(user => user.email.toLowerCase() === email);
        if (matchingUser)
            return matchingUser.id;
        else
            errorCallback(`No user found with email ${email}.`);
    } catch (err) {
        errorCallback(`Error finding Insight users. Error: ${err}`);
    }
};


module.exports = async (input, callback, error) => {
    secrets = input.secrets;
    let request = input.request,
        requestBody = request.body,
        email = requestBody.email.toLowerCase().trim();
    authKey = secrets["auth_x-api-key"];
    errorCallback = error;
    try {
        const userId = await getInsightUserId(email);
        request.url = request.url.replace('{userId}', userId);
        delete request.body.email;
        callback(request);
    } catch (err) {
        error(err);
    }
};