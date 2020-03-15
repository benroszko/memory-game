const gulp = require('gulp');
const sass = require('gulp-sass');

gulp.task('sass', function() {
	return gulp
		.src('app/styles/scss/*.scss')
		.pipe(sass()) // Converts Sass to CSS with gulp-sass
		.pipe(gulp.dest('app/styles/css/'));
});

gulp.task('default', function() {
	gulp.watch('app/styles/scss/*.scss', gulp.series([ 'sass' ]));
});
