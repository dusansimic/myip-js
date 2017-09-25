#!/usr/bin/env node

const internalIp = require('internal-ip');
const publicIp = require('public-ip');
const program = require('commander');

program
	.version('0.0.1')
	.option('-a, --all', 'Get all ips')
	.option('-l, --local', 'Get local ips only')
	.option('-g, --global', 'Get global ips only')
	.option('-4, --ip4', 'Get version 4 ips only')
	.option('-6, --ip6', 'Get version 6 ips only')
	.parse(process.argv);

const options = {
	get4: true,
	get6: true,
	getLocal: true,
	getGlobal: true
};

// Getting user inserted settings

if (program.local) {
	options.getGlobal = false;
	options.getLocal = true;
} else if (program.global) {
	options.getGlobal = true;
	options.getLocal = false;
}

if (program.ip4) {
	options.get4 = true;
	options.get6 = false;
} else if (program.ip6) {
	options.get4 = false;
	options.get6 = true;
}

if (program.all) {
	options.get4 = true;
	options.get6 = true;
	options.getLocal = true;
	options.getGlobal = true;
}

// Getting ips

if (options.getLocal) {
	if (options.get4) {
		internalIp.v4().then(ip => {
			console.log('Local v4: ' + ip);
		}).catch(err => {
			console.error(err);
		});
	}
	if (options.get6) {
		internalIp.v6().then(ip => {
			console.log('Local v6: ' + ip);
		}).catch(err => {
			console.error(err);
		});
	}
}
if (options.getGlobal) {
	if (options.get4) {
		publicIp.v4().then(ip => {
			console.log('Global v4: ' + ip);
		}).catch(err => {
			console.error(err);
		});
	}
	if (options.get6) {
		publicIp.v6().then(ip => {
			console.log('Global v6: ' + ip);
		}).catch(err => {
			if (err.toString().startsWith('Error: Query timed out')) {
				console.log('Global v6: (Error: Query timed out)');
			} else {
				console.error(err);
			}
		});
	}
}
