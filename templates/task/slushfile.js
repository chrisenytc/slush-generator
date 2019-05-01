
// Task: <%= taskName %> 
gulp.task('<%= taskName %>', getDefaultActionFunction(
    '/templates/<%= taskName %>/**',
    [{
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
    }],
    null,
    appPrepend.prepend('./')
))
