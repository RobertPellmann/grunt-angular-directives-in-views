'use strict';

var grunt = require('grunt');

function getNormalizedFile(filepath) {
  return grunt.util.normalizelf(grunt.file.read(filepath));
}

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.angular_directives_in_views = {
  view_simple: function(test) {
    test.expect(1)
    test.equal(grunt.file.exists('tmp/view_simple'), false)
    test.done()
  },
  view_simple_invalid: function(test) {
    test.expect(1)
    var actual = getNormalizedFile('tmp/view_simple_invalid')
    test.equal(actual, 'unknown directive <holla-world>\r\n')
    test.done()
  },
  view_multiple: function(test) {
    test.expect(1)
    test.equal(grunt.file.exists('tmp/view_multiple'), false)
    test.done()
  },
  view_invalid_one: function(test) {
    test.expect(1)
    var actual = getNormalizedFile('tmp/view_simple_invalid')
    test.equal(actual, 'unknown directive <holla-world>\r\n')
    test.done()
  },
  view_razor: function(test) {
    test.expect(1)
    test.equal(grunt.file.exists('tmp/view_razor'), false)
    test.done()
  }
}