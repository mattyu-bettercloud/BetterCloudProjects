const axios = require('axios');
let secrets;
let authKey;
let errorCallback;

const getInsightOrgRoleId = async (orgRoleName) => {
    const getRolesRequest = {
        method: "GET",
        url: `https://${secrets.insightRegion}.api.insight.rapid7.com/account/api/1/roles`,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-api-key': authKey
        }
    };
    try {
        const response = await axios(getRolesRequest);
        const roles = response.data,
            matchingRole = roles.find(role => role.organization_id && role.name.toLowerCase() === orgRoleName);
        if (matchingRole)
            return matchingRole.id;
        else
            errorCallback(`No role found with role name ${orgRoleName}. Must be admin, readwrite, or readonly.`);
    } catch (err) {
        errorCallback(`Error finding Insight roles. Error: ${err}`);
    }
};


module.exports = async (input, callback, error) => {
    secrets = input.secrets;
    let request = input.request,
        requestBody = request.body,
        orgRoleName = requestBody.orgRoleName.toLowerCase().trim();
    authKey = secrets["auth_x-api-key"];
    errorCallback = error;
    try {
        const orgRoleId = await getInsightOrgRoleId(orgRoleName);
        request.body = [orgRoleId];
        callback(request);
    } catch (err) {
        error(err);
    }
};