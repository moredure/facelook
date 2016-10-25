// Karma configuration
// Generated on Tue Oct 25 2016 00:35:24 GMT+0300 (MSK)
'use strict';

const webpackConfig = require('./testing.config.js');

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['chai', 'jasmine'],
    files: [
      'specs/**/*.spec.js'
    ],
    exclude: [
    ],
    preprocessors: {
        'specs/**/*.spec.js': ['webpack', 'sourcemap']
    },
    reporters: ['mocha', 'coverage'],
    plugins: [
        'karma-jasmine', 'karma-mocha',
        'karma-chai', 'karma-coverage',
        'karma-webpack', 'karma-phantomjs-launcher',
        'karma-mocha-reporter', 'karma-sourcemap-loader'
    ],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['PhantomJS'],
    singleRun: false,
    concurrency: Infinity,
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo:true
    }
  })
}
