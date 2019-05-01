/*
 * <%= appNameSlug %>
 */

'use strict';

const gulp = require('gulp')
const install = require('gulp-install')
const conflict = require('gulp-conflict')
const template = require('gulp-template')
const rename = require('gulp-rename')
const _ = require('lodash')
const inquirer = require('inquirer')
const appPrepend = require('gulp-append-prepend-dir')
const path = require('path')

function format(string) {
    var username = string.toLowerCase();
    return username.replace(/\s/g, '');
}

var defaults = (function () {
    var workingDirName = path.basename(process.cwd()),
        homeDir, osUserName, configFile, user;

    if (process.platform === 'win32') {
        homeDir = process.env.USERPROFILE;
        osUserName = process.env.USERNAME || path.basename(homeDir).toLowerCase();
    }
    else {
        homeDir = process.env.HOME || process.env.HOMEPATH;
        osUserName = homeDir && homeDir.split('/').pop() || 'root';
    }

    configFile = path.join(homeDir, '.gitconfig');
    user = {};

    if (require('fs').existsSync(configFile)) {
        user = require('iniparser').parseSync(configFile).user;
    }

    return {
        appName: workingDirName,
        userName: osUserName || format(user.name || ''),
        authorName: user.name || '',
        authorEmail: user.email || ''
    };
})();


/**
 * @param {*} srcPath - e.g. '/templates/default/**'
 * @param {*} prompts - inquirer prompts, requires 'moveon' confirmation
 * @param {*} answerProcessorFunc - if provided, must be a function that accepts 'answers' as parameter to process answers
 * @param {*} conflictTransform - a node stream.Transform that solves conflict in destination dir, examples: "conflict('./')", "appPrepend.prepend('./')"
 */
function getDefaultActionFunction(srcPath, prompts, answerProcessorFunc, conflictTransform) {
    return function (done) {
        //Ask
        inquirer
            .prompt(prompts)
            .then(function (answers) {
                if (!answers.moveon) {
                    return done();
                }
                if (answerProcessorFunc) {
                    answerProcessorFunc(answers)
                }
                gulp.src(__dirname + srcPath, { dot: true })
                    .pipe(template(answers, { 'interpolate': /<%=([\s\S]+?)%>/g }))
                    .pipe(rename(function (path) {
                        path.dirname = _.template(path.dirname)(answers)
                        path.basename = _.template(path.basename)(answers)
                        if (path.basename[0] === '_') {
                            path.basename = '.' + path.basename.slice(1);
                        }
                    }))

                    .pipe(conflictTransform)
                    .pipe(gulp.dest('./'))
                    .pipe(install())
                    .on('end', function () {
                        done();
                    });
            });
    }
}

// default task
gulp.task('default', getDefaultActionFunction(
    '/templates/default/**',
    [{
        name: 'appName',
        message: 'What is the name of your project?',
        default: defaults.appName
    }, {
        name: 'appDescription',
        message: 'What is the description?'
    }, {
        name: 'appVersion',
        message: 'What is the version of your project?',
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
        type: 'confirm',
        name: 'moveon',
        message: 'Continue?'
    }],
    null,
    conflict('./')
))
