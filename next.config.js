/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['meal-chunk-images-and-videos.s3.us-west-1.amazonaws.com','meal-chunk-images-and-videos.s3.amazonaws.com', 'lh3.googleusercontent.com'],
  }
}
// const path = require('path'); // Import the 'path' module
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: false,
//   images: {
//       domains: [
//           'meal-chunk-images-and-videos.s3.us-west-1.amazonaws.com',
//           'meal-chunk-images-and-videos.s3.amazonaws.com'
//       ],
//   },
//   webpack(config, { defaultLoaders }) {
//       config.module.rules.push({
//           test: /\.module\.css$/,
//           use: [
//               defaultLoaders.babel,
//               {
//                   loader: require.resolve('css-loader'),
//                   options: {
//                       modules: {
//                           localIdentName: '[local]__[hash:base64:5]',
//                       },
//                       importLoaders: 1,
//                   },
//               },
//               {
//                   loader: require.resolve('postcss-loader'),
//                   options: {
//                       postcssOptions: {
//                           config: path.resolve(__dirname, 'postcss.config.js'),
//                       },
//                   },
//               },
//           ],
//       });

//       return config;
//   },
// };

module.exports = nextConfig;


//module.exports = nextConfig
