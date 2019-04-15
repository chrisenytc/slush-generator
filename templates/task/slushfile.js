
// Task: <%= taskName %> 
// TODO: codes below are just example. Implement the task. 
gulp.task('<%= taskName %>', function (done) {
    var prompts = [{
        name: 'variable1',
        message: 'What is the value of variable1?',
        default: 'default value'
    }, {
        type: 'list',
        name: 'variableChosenFromList',
        message: 'Choose a value below',
        choices: ['1', '2'],
        default: '1'
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
            // maybe do something with the answers
            // render files and append to destination
            gulp.src(__dirname + '/templates/<%= taskName %>/somefile')
                .pipe(template(answers))
                .pipe(appPrepend.prependFile('./somefile'))
                .pipe(gulp.dest("./"))
                .on('end', function () {
                    done();
                });
            // render some other files and write to destination
            gulp.src([__dirname+'/templates/<%= taskName %>/otherfiles'])
                .pipe(template(answers))
                .pipe(rename(function (file) {
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
