const path = require('path');

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'motion.js',
		library: 'motion',
		libraryTarget: 'umd',
		libraryExport: 'default'
	},
	module: {
		rules: [
			{
				test: /\.html$/i,
				loader: 'html-loader'
			}
		]
	}
};
