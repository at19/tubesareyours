const authResolver = require("./auth");
const videosResolver = require("./videos");

const rootResolver = {
  ...authResolver,
  ...videosResolver
};

module.exports = rootResolver;
