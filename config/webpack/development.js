process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const environment = require('./environment')

module.exports = Object.assign(
    {},
    environment.toWebpackConfig(),
    {
        mode: "development",
        devtool: "#eval-source-map",
        devServer: {
            watchOptions: {
                poll: 500,
            },
        },
        resolve: { alias: { 'react-dom': '@hot-loader/react-dom' } },
    }
)
