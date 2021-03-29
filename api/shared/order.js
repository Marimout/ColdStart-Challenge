const fs = require('fs').promises;

const { config } = require('./config');

const sql = require('mssql')

async function postOrder(order) {
  console.log("Post order to database...");

  try {
    // make sure that any items are correctly URL encoded in the connection string
    await sql.connect(`mssql://${config.azure_mssql_username}:${config.azure_mssql_password}@coldstart.database.windows.net/coldstart?encrypt=true`);

    console.log(order);
    order.Icecreams.forEach(element => {
      for (var i = 0; i < element.Quantity; i++) {
        const request = new sql.Request();
        request.input('user', sql.VarChar, order.User);
        request.input('date', sql.DateTime, order.Date);
        request.input('status', sql.VarChar, 'New');
        request.input('icecreamId', sql.Int, element.Id);
        request.input('fullAddress', sql.VarChar, order.FullAddress)

        request.query("INSERT INTO Orders ([user], [date], [icecreamId], [status], [fullAddress]) VALUES (@user, @date, @icecreamId, @status, @fullAddress)", (err, result) => {
          if (err) console.log(err);
        });
      }
    });
  } catch (err) {
    console.error("ERROR:" + err);
  }
}

module.exports = { postOrder };
