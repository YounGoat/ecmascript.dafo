'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	
	/* NPM */
	
	/* in-package */
	;

/**
 * Generally, the expression is used to describe age of (HTTP) cache.
 * 因为这种表达式通常于代表缓存时间，故命名为 age。
 */
const reAges = /(?<num>\d+)(?<unit>ms|s|m|h|d|D|w|W|M|Q|S|H|y|Y)/g;

const MULTI = {
	ms     :    0.001, // MicroSecond
	s      :        1, // Second
	m      :       60, // Minute
	h      :     3600, // Hour
	d      :    86400, // Day
	D      :    86400, // Day
	w      :   604800, // Week     = 86400 * 7
	W      :   604800, // Week     = 86400 * 7
	M      :  2592000, // Month    = 86400 * 30
	S      :  7776000, // Season   = 86400 * 90
	Q      :  7776000, // Quarter  = 86400 * 91.25
	H      : 15768000, // Half     = 86400 * 182.5
	y      : 31536000, // Year     = 86400 * 365
	Y      : 31622400, // leapYear = 86400 * 366
};

/**
 * @param {string|number} age 
 * @returns {number}
 */
function toSeconds(age) {
	if (typeof age == 'number') {
		return age
	}
	
	if (typeof age != 'string') {
		throw new Error(`invalid argument "age": ${age}`);
	} 
	
	let matches = Array.from(age.matchAll(reAges))
	if (matches.length == 0) {
		throw new Error(`invalid argument "age": ${age}`);
	}

	let seconds = 0;
	matches.forEach(match => {
		let { num, unit } = match.groups;
		num = parseInt(num);
		seconds += Math.ceil(num * MULTI[unit]);
	})
	return seconds;
};

module.exports = toSeconds;