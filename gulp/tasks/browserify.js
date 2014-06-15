/* browserify task
   ---------------
   Bundle javascripty things with browserify!

   If the watch task is running, this uses watchify instead
   of browserify for faster bundling using caching.
*/

var browserify   = require('browserify');
var watchify     = require('watchify');
var bundleLogger = require('../util/bundleLogger');
var gulp         = require('gulp');
var handleErrors = require('../util/handleErrors');
var source       = require('vinyl-source-stream');
var config       = require('../config');
var gutil        = require('gulp-util');

gulp.task('browserify', function() {

	var bundleMethod = global.isWatching ? watchify : browserify;

	var bundler = bundleMethod({
		// Specify the entry point of your app
		entries: [config.src + '/js/app.js'],
		// Add file extentions to make optional in your requires
		extensions: ['.js', '.hbs', '.jade'],
	});

	var bundle = function() {
		// Log when bundling starts
		bundleLogger.start();

		return bundler
			// Enable source maps!
			.bundle({debug: true})
			// Report compile errors
			.on('error', handleErrors)
			// Use vinyl-source-stream to make the
			// stream gulp compatible. Specifiy the
			// desired output filename here.
			.pipe(source('app.js'))
			// Specify the output destination
			.pipe(gulp.dest(config.dest + '/'))
			// Log when bundling completes!
			.on('end', bundleLogger.end);
	};

	if(global.isWatching) {
    gutil.log('watching');
		// Rebundle with watchify on changes.
		bundler.on('update', bundle);
	}

	return bundle();
});
