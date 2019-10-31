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
  },
  pluginOptions: {
    electronBuilder: {
      externals: ['!@mdi/font', 'leveldown', 'levelup']
    }
  }
}
