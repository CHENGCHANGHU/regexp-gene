const path = require('path');
const package = require('./package.json');
const externalDependencies = [
  ...Object.keys(package.dependencies || {}),
  ...Object.keys(package.peerDependencies || {}),
];

// console.log(process.argv);
// console.log('mode:', process.env.mode);
// console.log('minimize:', process.env.minimize);

function getWebpackConfig () {
  return {
    mode: 'production',
    // mode: 'development',
    // optimization: {
    //   minimize: false,
    // },
    // mode: process.env.mode,
    // optimization: {
    //   minimize: JSON.parse(process.env.minimize),
    // },
    entry: {
      index: path.join(__dirname, 'src', 'index.js'),
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.js',
      globalObject: 'typeof self === \'undefined\' ? this : self',
      library: {
        name: 'RegExpGene',
        type: 'umd',
      },
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: path.join(__dirname, '..', 'node_modules')
        },
      ],
    },
    externals: [
      ({ request }, callback) => {
        if (externalDependencies.some(dep => dep === request || request.startsWith(`${dep}/`))) {
          return callback(null, {
            commonjs2: request,
            commonjs: request,
            module: request,
          });
        }
        callback();
      },
    ],
  };
}

module.exports = getWebpackConfig();
