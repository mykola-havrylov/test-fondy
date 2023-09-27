const http = require('http');
const CloudIpsp = require('cloudipsp-node-js-sdk');
const { v4: uuidv4 } = require('uuid');

const merchantId = 1396424;
const secretKey = 'test';
const amount = 1000;
const currency = 'USD';
const orderDesc = 'Test order';
const orderId = uuidv4();

const fondy = new CloudIpsp({
	merchantId: merchantId,
	secretKey: secretKey,
});

const data = {
	order_id: orderId,
	order_desc: orderDesc,
	currency: currency,
	amount: amount,
};

const callbackUrl = 'http://localhost:8081/';

http
	.createServer(function (req, res) {
		fondy
			.Checkout({ ...data, response_url: callbackUrl })
			.then(data => {
				console.log(data.checkout_url);
				res.writeHead(302, { Location: data.checkout_url });
				res.end();
			})
			.catch(error => {
				console.log(error);
			});
	})
	.listen(8080);

http
	.createServer(function (req, res) {
		let body = '';
		req.on('data', chunk => {
			body += chunk.toString();
		});
		req.on('end', () => {
			// console.log(body);
			const jsonString = new URLSearchParams(body.toString());

			console.log(jsonString);

			const data = {};
			for (const [key, value] of jsonString) {
				data[key] = value;
			}

			console.log(data);

			res.writeHead(200, { 'Content-Type': 'text/html' });

			res.write('<ul>');

			for (const key in data) {
				if (data.hasOwnProperty(key)) {
					res.write(`<li>${key}: ${data[key]}</li>`);
				}
			}
			res.write('</ul>');
			res.end();
		});
	})
	.listen(8081);

console.log('Server running at http://localhost:8080/');
console.log('Callback server running at http://localhost:8081/');
