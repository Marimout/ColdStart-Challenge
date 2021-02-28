module.exports = async function (context, req) {
  try {
    const user = {
      "clientPrincipal": {
        "identityProvider": "facebook",
        "userId": "23cd35a5415e489e92804c2020e2dac9",
        "userDetails": "user@example.com",
        "userRoles": [
          "anonymous",
          "authenticated"
        ]
      }
    };

    context.res.status(200).send(user);
  } catch (error) {
    context.res.status(500).send(error);
  }
};
