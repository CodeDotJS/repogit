#!/usr/bin/env node

'use strict';

const dns = require('dns');
const got = require('got');
const cheerio = require('cheerio');
const chalk = require('chalk');
const logUpdate = require('log-update');
const ora = require('ora');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');

updateNotifier({pkg}).notify();

const spinner = ora();
const arg = process.argv[2];
const inf = process.argv[3] || '-search';
const pgi = process.argv[4] || '';
const log = console.log;
const end = process.exit;

if (!arg) {
	log(`
			Search GitHub Repositories

 Usage    : repogit <repository>
	  : repogit <repository> [commands]
	  : repogit <repository> [commands] <next-page>

 Commands :
  -search                     Normal search
  -best--match                Find the best match
  -most--stars                Find repositories with most stars
  -few--stars                 Find repositories with the least stars
  -most--forks                Find repositories with most forks
  -few--forks                 Find repositories with lest forks
  -recently--updated          Find recently updated repositories
  -least-recently--updated    Find least recently updated repositories

 Help     :
  $ repogit nodejs
  $ repogit google -most--stars
  $ repogit "twitter bot js" -search 2
  $ repogit "github bot" -recently--updated 3
 `);
	end(1);
}

dns.lookup('github.com', err => {
	if (err) {
		logUpdate(`\n ${chalk.red('✖')}  Connection error. Fix it now!\n`);
		end(1);
	} else {
		logUpdate();
		spinner.text = `Searching...`;
		spinner.start();
	}
});

const urls = {
	'-search': `https://github.com/search?&utf8=%E2%9C%93&q=${arg}`,
	'-best--match': `https://github.com/search?p=${pgi}&o=desc&q=${arg}&s=&type=Repositories&utf8=%E2%9C%93`,
	'-most--stars': `https://github.com/search?p=${pgi}&o=desc&q=${arg}&s=stars&type=Repositories&utf8=%E2%9C%93`,
	'-few--stars': `https://github.com/search?p=${pgi}&o=asc&q=${arg}&s=stars&type=Repositories&utf8=%E2%9C%93`,
	'-most--forks': `https://github.com/search?p=${pgi}&o=desc&q=${arg}&s=forks&type=Repositories&utf8=%E2%9C%93`,
	'-few--forks': `https://github.com/search?p=${pgi}&o=asc&q=${arg}&s=forks&type=Repositories&utf8=%E2%9C%93`,
	'-recently--updated': `https://github.com/search?p=${pgi}&o=desc&q=${arg}&s=updated&type=Repositories&utf8=%E2%9C%93`,
	'-least-recently--updated': `https://github.com/search?p=${pgi}&o=asc&q=${arg}&s=updated&type=Repositories&utf8=%E2%9C%93`
};

const url = urls[inf];

got(url).then(res => {
	const diff = res.body;
	const part = diff.split('repo-list">')[1];
	const $ = cheerio.load(part);
	const repo = $('h3');
	logUpdate();

	for (let i = 0; i < repo.length; i++) {
		const tag = $('h3').eq(i).text();
		let stars = $('.muted-link').eq(i).text();
		if (stars.length === 0) {
			stars = '0';
		}

		let details = $('.d-inline-block').eq(i).text();
		if (details.length <= 21) {
			details = '-';
		}

		let language = $('.d-table-cell').eq(i).text();
		if (language.length === 3) {
			language = 'no language set';
		}

		const created = $('.mt-2').eq(i).text();

		log(chalk.green('  ⚡⚡   ') + tag.trim() + '  [' + chalk.dim('https://github.com/' + tag.trim()) + ']');
		log(chalk.keyword('orange')('  ⭐⭐   ') + chalk.cyan(stars.trim() + ' stars ') + '| ' + chalk.blue(language.trim()) + ' | ' + created.trim());
		log(chalk.keyword('teal')('  💬    ') + chalk.dim(details.trim()));
		log();
	}
	spinner.stop();
}).catch(err => {
	if (err) {
		logUpdate(`\n ${chalk.red('✖ ')} Sorry! couldn't find any repository.\n\n ${chalk.keyword('orange')('✔  ')}${err.statusMessage}\n`);

		end(1);
	}
});
