'use strict'

const Hapi = require('hapi');
const Request = require('request');
const Vision = require('vision');
const Handlebars = require('handlebars');
const LodashFilter = require('lodash.filter');
const LodashTake = require('lodash.take');

const server = new Hapi.Server();

server.connection({
	host: '127.0.0.1',
	port: 4000
});

// Register vision for our views
server.register(Vision, (err) => {
	server.views({
		engines: {
			html: Handlebars
		},
		relativeTo: __dirname,
		path: './views',
	});
});


// Mostrar posiciones de equipos
server.route({
	method: 'GET',
	path: '/',
	handler: function (request, reply) {
		Request.get('https://api.coindesk.com/v1/bpi/currentprice.json', function (error, response, body) {
			if (error) {
				throw error;
			}

			const data = JSON.parse(body);
			reply.view('index', { result: data });
		});
	}
});


// Una función de ayuda a extraer la ID del equipo  
Handlebars.registerHelper('bpiID', function (bpiUrl) {
	return bpiUrl.slice(38);
});

server.start((err) => {
	if (err) {
		throw err;
	}

	console.log(`Servidor Ejecutando...: ${server.info.uri}`);
});