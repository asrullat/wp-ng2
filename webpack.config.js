var path = require('path');
var webpack = require('webpack');

var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var ENV = process.env.npm_lifecycle_event;
var isProd = ENV === 'build';



module.exports = function () {
	var config = {};

	if (isProd) config.devtool = 'source-map';
	else config.devtool = 'eval-source-map';

	config.context = root('src', 'scripts');

	config.entry = {
		polyfills: ['./polyfills'],
		vendor: ['./vendor'],
		app: ['./main'] // our angular app
	};

	config.output = {
		path: root('build', 'assets'),
		publicPath: '/build/assets',
		filename: '[name].bundle.js'
	};

	config.resolve = {
		extensions: ['.ts', '.js', '.json', '.css', '.scss', '.html']
	};


	config.devServer = {
		contentBase: 'build',
		historyApiFallback: true,
		quiet: false,
		stats: true
	};

	config.module = {
		rules: [
			{
				test: /\.ts$/,
				use: ['awesome-typescript-loader', 'angular2-template-loader', '@angularclass/hmr-loader'],
				exclude: [/\.(spec|e2e)\.ts$/, /node_modules\/(?!(ng2-.+))/]
			},
			{
				test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				use: 'file-loader'
			},
			{
				test: /\.json$/,
				use: 'json-loader'
			},
			// bundle all css in src/styles
			{
				test: /\.css$/,
				exclude: root('src', 'scripts'),
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader', 'postcss-loader']
				})
			},
			// all css required in src/app files will be merged in js files
			{
				test: /\.css$/,
				include: root('src', 'scripts'),
				use: ['raw-loader', 'postcss-loader']
			},
			// all css in src/style will be bundled in an external css file
			{
				test: /\.(scss|sass)$/,
				exclude: [/node_modules/, root('src', 'scripts')],
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader', 'postcss-loader', 'sass-loader']
				})
			},
			// all css required in src/app files will be merged in js files
			{
				test: /\.(scss|sass)$/,
				exclude: root('src', 'styles'),
				use: ['raw-loader', 'postcss-loader', 'sass-loader']
			},
			{
				test: /\.html$/,
				use: 'raw-loader',
				exclude: /node_modules/
			}
		]
	};

	config.plugins = [
		new webpack.DefinePlugin({
			'process.env': {
				ENV: JSON.stringify(ENV)
			}
		}),
		new webpack.ContextReplacementPlugin(
			/angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
			root('./src')
		),
		new CommonsChunkPlugin({
			name: 'common'
		}),
		new HtmlWebpackPlugin({
			filename: '../index.html',
			template: root('src', 'docs', 'index.html'),
			chunksSortMode: function (prev, next) {
				var dep = ['polyfills', 'vendor', 'app'];
				return dep.indexOf(prev['names'][0]) - dep.indexOf(next['names'][0])
			}//,
			// chunksSortMode: 'dependency',
			// inject: 'body'
		}),
		new ExtractTextPlugin("styles.css"),
		new CopyWebpackPlugin([{
			from: root('src', 'fonts')
		}]),
		new CopyWebpackPlugin([{
			from: root('src', 'images')
		}])
	];


	return config;

}();


// Helper functions
function root(args) {
	args = Array.prototype.slice.call(arguments, 0);
	return path.join.apply(path, [__dirname].concat(args));
}