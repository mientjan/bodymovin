let webpack = require('webpack');
let path = require('path');

let config = {
	context: __dirname + '/player', // `__dirname` is root of project and `src` is source
	entry: {
		app: './js/index.js',
	},
	module: {
		rules: [
			{
				test: /\.js$/, //Check for all js files
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['es2015']
						}
					}
				]
			},
		]
	},
	resolve:{
		alias: {
			demo: path.resolve(__dirname, 'demo/'),
		},
	},
	output: {
		path: __dirname + '/build', // `dist` is the destination
		filename: 'bodymovin.js',
	},
	devServer: {
		open: true, // to open the local server in browser
		contentBase: __dirname + '/',
	},

	devtool: "eval-source-map"
};

if (process.env.NODE_ENV === "production") {
	config.devtool = "source-map";
}

module.exports = config;