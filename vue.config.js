module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /favicon\.ico$/,
          loader: 'file-loader'
        }
      ]
    }
  }
}
