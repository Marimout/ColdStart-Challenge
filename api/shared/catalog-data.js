const fs = require('fs').promises;

const { config} = require('../shared/config');

const sql = require('mssql')

async function getCatalog() {
  console.log("Reading rows from the Table...");

  try {
    // make sure that any items are correctly URL encoded in the connection string
    await sql.connect(`mssql://${config.azure_mssql_username}:${config.azure_mssql_password}@coldstart.database.windows.net/coldstart?encrypt=true`);
    const result = await sql.query`SELECT * FROM [dbo].[Icecreams]`;
    return result.recordset;
  } catch (err) {
    console.error("ERROR:" + err);
  }
}

async function getCatalogStatic() {
  console.log('using static data.');
  var stringData = await fs.readFile('./shared/catalog.json', 'utf8');
  const data = JSON.parse(stringData);
  return data.icecreams;
}

module.exports = { getCatalog };
