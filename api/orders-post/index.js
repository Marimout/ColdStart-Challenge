const { postOrder } = require('../shared/order');

module.exports = async function (context, req) {
  await postOrder(req.body);

  context.res.status(201);
};
