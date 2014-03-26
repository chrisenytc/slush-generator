/*
 * slush-generator
 * https://github.com/chrisenytc/slush-generator
 *
 * Copyright (c) 2014, Christopher EnyTC
 * Licensed under the MIT license.
 */

'use strict';

var gulp = require('gulp'),
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    rename = require('gulp-rename'),
    _ = require('underscore.string'),
    inquirer = require('inquirer');

gulp.task('default', function(done) {
    var prompts = [{
        name: 'appName',
        message: 'What the name of your slush generator?'
    }, {
        name: 'appDescription',
        message: 'What the description?'
    }, {
        name: 'appVersion',
        message: 'What the version of your slush generator?',
        default: '0.1.0'
    }, {
        name: 'authorName',
        message: 'What the author name?',
    }, {
        name: 'authorEmail',
        message: 'What the author email?',
    }, {
        name: 'userName',
        message: 'What the github username?',
    }, {
        type: 'list',
        name: 'license',
        message: 'Choose your license type',
        choices: ['MIT', 'BSD'],
        default: 'MIT'
    }];
    //Ask
    inquirer.prompt(prompts,
        function(answers) {
            if (!answers.appName) {
                return done();
            }
            answers.appNameSlug = _.slugify(answers.appName)
            answers.appNameOnly = answers.appNameSlug.replace('slush-', '');
            var d = new Date();
            answers.year = d.getFullYear();
            answers.date = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
            var files = [__dirname + '/templates/**'];
            if (answers.license === 'MIT') {
                files.push('!' + __dirname + '/templates/LICENSE_BSD');
            } else {
                files.push('!' + __dirname + '/templates/LICENSE_MIT');
            }
            gulp.src(files)
                .pipe(template(answers))
                .pipe(rename(function(file) {
                    if (answers.license === 'MIT') {
                        var mit = file.basename.replace('LICENSE_MIT', 'LICENSE');
                        file.basename = mit;
                    } else {
                        var bsd = file.basename.replace('LICENSE_BSD', 'LICENSE');
                        file.basename = bsd;
                    }
                    if (file.basename[0] === '_') {
                        file.basename = '.' + file.basename.slice(1);
                    }
                }))
                .pipe(conflict('./'))
                .pipe(gulp.dest('./'))
                .pipe(install())
                .on('end', function() {
                    done();
                });
        });
});
