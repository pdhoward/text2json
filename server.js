////////////////////////////////////////////
//   File Conversions - Create Mock Data //
//////////////////////////////////////////

//   without using express
const path = 		require('path')
const http = 		require('http')
const {add, 
	   accounts,
	   convert, 
	   rndr} = 		require('./routes')

const host = 'localhost'
const port = '3000'

// The routes object holds the paths
const routes = {
	'/': (req, res) => rndr({
		filename: path.resolve(__dirname, 'index.html'),
		contentType: 'text/html'
	}, res),
	'/app.css': (req, res) => rndr({
		filename: path.resolve(__dirname, 'app.css'),
		contentType: 'text/html'
	}, res),
	'/app.js': (req, res) => rndr({
		filename: path.resolve(__dirname, 'app.js'),
		contentType: 'text/html'
	}, res),
	'/add': (req, res) => add(req, res),
	'/accounts': (req, res) => accounts(req, res),
	'/convert': (req,res) => convert(req,res)
}

// The server parses an incoming http message and attempts to resolve
// the path. If found, the respective route is executed
const server = http.createServer((req, res) => {
	const url = require('url').parse(req.url);

	if (routes[url.path]) return routes[url.path](req, res);

	res.writeHead(404, {'Content-Type': 'application/json'});
	res.end(JSON.stringify({
		response: 'failed',
		data: null,
		message: 'resource not found'
	}))
})

server.listen(port, host, () => {
	console.log(`server started: http://${host}:${port}`);
});
