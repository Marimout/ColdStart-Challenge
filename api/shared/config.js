// @ts-check
const process = require("process");

const config = {
    azure_storage_connectionstring: process.env.AZURE_STORAGE_CONNECTION_STRING,
    azure_mssql_username: process.env.AZURE_MSSQL_USERNAME,
    azure_mssql_password: process.env.AZURE_MSSQL_PASSWORD,
    azure_personalizer_key: process.env.AZURE_PERSONALIZER_KEY,
    azure_personalizer_endpoint: process.env.AZURE_PERSONALIZER_ENDPOINT
};

module.exports = { config };
