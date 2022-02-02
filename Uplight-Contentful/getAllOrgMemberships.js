const axios = require('axios');
let secrets;
let errorCallback;
let apiToken;
let email;

const getAllUsersAndFindId = async (email) => {
    const request = {
        method: "GET",
        url: `https://api.contentful.com/organizations/${secrets.organizationId}/users?limit=100`,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/vnd.contentful.management.v1+json',
            'Authorization': `${apiToken}`
        }
    };
    try {
        const response = await axios(request);
        const users = response.data.items;
        const MatchingUser = users.find(user => user.email === email); // email is in the user response
        if (MatchingUser)
            return MatchingUser.sys.id;
        else
            errorCallback(`No existing user for that email: ${email}`);
    } catch (err) {
        errorCallback(`Error finding User Id. Error: ${err}`);
    }
};

const getAllOrgMemberships = async (userId) => {
    const request = {
        method: "GET",
        url: `https://api.contentful.com/organizations/${secrets.organizationId}/organization_memberships?limit=100`,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/vnd.contentful.management.v1+json',
            'Authorization': `${apiToken}`
        }
    };
    try {
        const response = await axios(request);
        const orgMemberships = response.data.items;
        const MatchingOrgMembership = orgMemberships.find(orgMembership => orgMembership.sys.user.sys.id === userId); // filter vs. find
        if (MatchingOrgMembership)
            return MatchingOrgMembership.sys.user.sys.id;
        else
            errorCallback(`No matching org membership Id for that userId: ${userId}`);
    } catch (err) {
        errorCallback(`Error finding organizationMembershipId. Error: ${err}`);
    }
};

module.exports = async (input, callback, error) => { // exported function that is called
    secrets = input.secrets; // from here on, i am confused --> accessing what is in request
    let request = input.request,
        requestBody = request.body,
        email = requestBody.email,
        url = request.url;
    apiToken = secrets.apiToken;
    errorCallback = error;
    try {
        const userId = await getAllUsersAndFindId(email);
        const orgMembershipId = await getAllOrgMemberships(userId)
        const deleteUrlEndpoint = url.replace('{organizationMembershipId}', orgMembershipId);
        request.url = deleteUrlEndpoint;
        // request.url --> request[deleteUrlEndpoint]
    // function -> name what it is doing
        // variable -> name what it is at end
        callback(request); // build up a new request out of all the components in module exports (pre-req)
    } catch (err) {
        errorCallback(err);
    }
};