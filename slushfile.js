/*
 * slush-generator
 * https://github.com/chrisenytc/slush-generator
 *
 * Copyright (c) 2015, Christopher EnyTC
 * Licensed under the MIT license.
 */

'use strict';

var gulp = require('gulp'),
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    rename = require('gulp-rename'),
    _ = require('underscore.string'),
    inquirer = require('inquirer'),
    appPrepend = require('gulp-append-prepend'),
    fs = require('fs'),
    path = require('path');


function format(string) {
    var username = string.toLowerCase();
    return username.replace(/\s/g, '');
}


var defaults = (function () {
    var workingDirName = path.basename(process.cwd()); 
	var homeDir; 
	var osUserName; 
	var configFile;
   	var user = {};

    if (process.platform === 'win32') {
        homeDir = process.env.USERPROFILE;
        osUserName = process.env.USERNAME || path.basename(homeDir).toLowerCase();
    }
    else {
        homeDir = process.env.HOME || process.env.HOMEPATH;
        osUserName = homeDir && homeDir.split('/').pop() || 'root';
    }

    configFile = path.join(homeDir, '.gitconfig');

    if (require('fs').existsSync(configFile)) {
        user = require('iniparser').parseSync(configFile).user;
    }

    return {
        appName: workingDirName,
        userName: osUserName || format((user && user.name) || ''),
        authorName: (user && user.name) || '',
        authorEmail: (user && user.email) || ''
    };
})();


gulp.task('default', function (done) {
    var prompts = [{
        name: 'appName',
        message: 'What is the name of your slush generator?',
        default: defaults.appName
    }, {
        name: 'appDescription',
        message: 'What is the description?'
    }, {
        name: 'appVersion',
        message: 'What is the version of your slush generator?',
        default: '0.1.0'
    }, {
        name: 'authorName',
        message: 'What is the author name?',
        default: defaults.authorName
    }, {
        name: 'authorEmail',
        message: 'What is the author email?',
        default: defaults.authorEmail
    }, {
        name: 'userName',
        message: 'What is the github username?',
        default: defaults.userName
    }, {
        type: 'list',
        name: 'license',
        message: 'Choose your license type',
        choices: ['MIT', 'BSD'],
        default: 'MIT'
    }, {
        type: 'confirm',
        name: 'moveon',
        message: 'Continue?'
    }];
    //Ask
    inquirer
        .prompt(prompts)
        .then(function (answers) {
            if (!answers.moveon) {
                return done();
            }
            answers.appNameSlug = _.slugify('Slush ' + answers.appName);
            answers.appNameOnly = _.capitalize(answers.appNameSlug.replace('slush-', ''));
            var d = new Date();
            answers.year = d.getFullYear();
            answers.date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
            var files = [__dirname + '/templates/default/**'];
            if (answers.license === 'MIT') {
                files.push('!' + __dirname + '/templates/default/LICENSE_BSD');
            } else {
                files.push('!' + __dirname + '/templates/default/LICENSE_MIT');
            }
            gulp.src(files)
                .pipe(template(answers))
                .pipe(rename(function (file) {
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
                .on('end', function () {
                    done();
                });
        });
});

gulp.task('task', function (done) {
    var prompts = [{
        name: 'taskName',
        message: 'What is the name of your task?'
    },{
        type: 'confirm',
        name: 'moveon',
        message: 'Continue?'
    }
    ];
    //Ask
    inquirer
        .prompt(prompts)
        .then(function (answers) {
            if (!answers.moveon) {
                return done();
            }
            // create an empty task folder in template
            fs.mkdirSync('./templates/'+answers.taskName)
            console.log("Created template dir ./templates/"+answers.taskName)
            // append a task to slushfile.js
            gulp.src(__dirname + '/templates/task/slushfile.js')
                .pipe(template(answers))
                .pipe(appPrepend.prependFile('./slushfile.js'))
                .pipe(gulp.dest("./"))
                .on('end', function () {
                    done();
                });
        });
        
    });
