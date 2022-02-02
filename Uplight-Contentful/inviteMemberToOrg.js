const axios = require('axios');
let secrets; // environment variables are located in here
let errorCallback;
// let apiToken;

const inviteMemberToOrg = async () => { // where does email go
    const request = {
        method: "POST",
        url: `https://api.contentful.com/organizations/${secrets.organizationId}/invitations`, // environment variable in BC
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json', // tells endpoint the format is json only
            'Authorization': `Bearer ${apiToken}` // each request requires authentication according to Contentful docs:A valid Content Management API token must be included for all requests documented in this section
        }
    };
    try {
        const response = await axios(request); // WHAT DOES THE ENDPOINT DO --> IS THERE DATA?? --> no data and axios default error
        // axios request fails means it will automatically go to catch --> default axios throws error for non 2xx responses
    } catch (err) {
        errorCallback(`Invalid organization ID: ${secrets.organizationId}`);
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