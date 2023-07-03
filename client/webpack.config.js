const Dotenv = require('dotenv-webpack');

module.exports = {
  plugins: [
    new Dotenv({
      path: '.env' // default is .env
    })
  ],
  devServer: {
    overlay: {
      warnings: false,
      errors: true
    }
  },
};