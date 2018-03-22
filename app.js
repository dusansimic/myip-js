#!/usr/bin/env node

const internalIp = require('internal-ip');
const publicIp = require('public-ip');
const meow = require('meow');
const chalk = require('chalk');
const updateNotifier = require('update-notifier');

const cli = meow(`
	Usage
		$ ${chalk.yellow('myip')} [options]

	Options
		--version      Get version number
		-a, --all      Get all IP's
		-l, --local    Get local IP's only
		-g, --global   Get global IP's only
		-4, --ip4      Get version 4 IP's only
		-6, --ip6      Get Version 6 IP's only
		--help         Get this help`, {
	autoHelp: true,
	flags: {
		all: {
			type: 'boolean',
			alias: 'a'
		},
		local: {
			type: 'boolean',
			alias: 'l'
		},
		global: {
			type: 'boolean',
			alias: 'g'
		},
		ip4: {
			type: 'boolean',
			alias: '4'
		},
		ip6: {
			type: 'boolean',
			alias: '6'
		}
	}
});

const options = {
	get4: true,
	get6: true,
	getLocal: true,
	getGlobal: true
};

// Getting user inserted settings

if (cli.flags.local) {
	options.getGlobal = false;
} else if (cli.flags.global) {
	options.getLocal = false;
}

if (cli.flags.ip4) {
	options.get6 = false;
} else if (cli.flags.ip6) {
	options.get4 = false;
}

// Getting IP's

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

const pkg = require('./package.json');
const notifier = updateNotifier({pkg});
notifier.notify();
