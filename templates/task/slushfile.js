// Task: <%= taskName %> 
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
            gulp.src(__dirname + '/templates/<%= taskName %>/**')
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
