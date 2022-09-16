// const { gene } = require('../lib/cjs-module.js');
const { gene } = require('../dist');

console.log(gene(/foo/));
// foo

console.log(gene(/[abc]/));
// a, b, c

console.log(gene(/[^abc]/));
// a, b, c

console.log(gene(/./));
//

console.log(gene(/\w/));
//

console.log(gene(/\d/));
//

console.log(gene(/\\/));
// \

console.log(gene(/(foo(bar)foo)/));
// foobarfoo

console.log(gene(/a+/));
// aaaaaa...

console.log(gene(/a*/));
// aaaaaa...

console.log(gene(/a{1,3}/));
// aa

console.log(gene(/ab?/));
// a or ab

console.log(gene(/a(b|c)d/));
// abd or acd