var modelPath = 'js/models/*.js';
var viewPath = 'js/views/*.js';

var gulp = require('gulp'),
    gpConcat = require('gulp-concat'),
    gpRename = require('gulp-rename'),
    gpUglify = require('gulp-uglify');

gulp.task('watch', function() {

    console.log("Watching ...");
    gulp.watch('**/*.js',['model','view']);

});

gulp.task('js',['model','view'], function(){});

gulp.task('model', function(){
    console.log("Reload Models");
    gulp.src(modelPath)
        .pipe(gpConcat('concat.js'))
        .pipe(gpRename('models.min.js'))
        //.pipe(gpUglify())
        .pipe(gulp.dest('js/public'));
});

gulp.task('view', function(){
    console.log("Reload Views");
    gulp.src(viewPath)
        .pipe(gpConcat('concat.js'))
        .pipe(gpRename('views.min.js'))
        //.pipe(gpUglify())
        .pipe(gulp.dest('app/js/public'));
})

gulp.task('default', ['watch', 'js'], function(){});