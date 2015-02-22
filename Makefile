# slush-generator
# https://github.com/chrisenytc/slush-generator
#
# Copyright (c) 2015, Christopher EnyTC
# Licensed under the MIT license.


test:
	@NODE_ENV=test ./node_modules/mocha/bin/mocha -R spec

.PHONY: test