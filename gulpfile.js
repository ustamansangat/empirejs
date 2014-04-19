// Include gulp
var gulp = require('gulp'); 

// Include Our Plugins
var exclude = require('gulp-ignore').exclude; 
var jshint = require('gulp-jshint');
var eslint = require('gulp-eslint');

// Lint Task
gulp.task('lint', function() {
    return gulp.src('./public/**/*.js')
        .pipe(exclude('**/deps/**'))
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('eslint', function () {
    return gulp.src('./public/**/*.js')
        .pipe(exclude('**/deps/**'))
        .pipe(eslint({
            rulesdir:'es-rules/',
            rules:{
                quotes: [2,"single"],
                "no-prototype-without-new": 2
            },
            globals: {
                '$': true,
                'jQuery': false
            },
            env:{
                browser:true
            }
        }))
        .pipe(eslint.formatEach('compact', process.stderr));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('./public/**/*.js', ['lint']);
});

// Default Task
gulp.task('default', ['lint', 'watch']);
