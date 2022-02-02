const axios = require('axios');
let secrets;
let authKey;
let errorCallback;

const getInsightProductToken = async (productCode) => {
    const getProductsRequest = {
        method: "GET",
        url: `https://${secrets.insightRegion}.api.insight.rapid7.com/account/api/1/products`,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-api-key': authKey
        }
    };
    try {
        const response = await axios(getProductsRequest);
        const products = response.data,
            matchingProduct = products.find(product => product.product_code.toLowerCase() === productCode);
        if (matchingProduct)
            return matchingProduct.product_token;
        else
            errorCallback(`No product found with product code ${productCode}.`);
    } catch (err) {
        errorCallback(`Error finding Insight products. Error: ${err}`);
    }
};


module.exports = async (input, callback, error) => {
    secrets = input.secrets;
    let request = input.request,
        requestBody = request.body,
        productCode = requestBody.productCode.toLowerCase().trim();
    authKey = secrets["auth_x-api-key"];
    errorCallback = error;
    try {
        const productToken = await getInsightProductToken(productCode);
        request.url = request.url.replace('{productToken}', productToken);
        delete request.body.productCode;
        callback(request);
    } catch (err) {
        errorCallback(err);
    }
};