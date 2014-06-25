/*
 * slush-generator
 * https://github.com/chrisenytc/slush-generator
 *
 * Copyright (c) 2014, Christopher EnyTC
 * Licensed under the MIT license.
 */

'use strict';

var chai = require('chai');
chai.expect();
chai.should();

describe('slush-generator module', function() {
    describe('#test', function() {
        it('should return a hello', function() {
            'Hello Slush'.should.equal('Hello Slush');
        });
    });
});
