const axios = require('axios');
let secrets;
let errorCallback;
let apiToken;
let email;

const deleteOr = async () => {
    const request = {
        method: "GET",
        url: `https://api.contentful.com//organizations/${secrets.organizationId}/organization_memberships`,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/vnd.contentful.management.v1+json',
            'Authorization': `${apiToken}`
        }
    };
    try {
        const response = await axios(request);
        const users = response.data;
        const findOrgMembershipId = users.find(user => user.email === email);
        if (findOrgMembershipId)
            return findOrgMembershipId.id;
        else
            errorCallback(`No existing user found in organization with that email.`);
    } catch (err) {
        errorCallback(`Error finding organizationMembershipId. Error: ${err}`);
    }
};

module.exports = async (input, callback, error) => { // exported function that is called
    secrets = input.secrets; // from here on, i am confused --> accessing what is in request
    let request = input.request,
        requestBody = request.body,
        email = requestBody.email,
        apiToken = secrets.apiToken;
    errorCallback = error;
    try {

        callback(request);
    } catch (err) {
        errorCallback(err);
    }
};