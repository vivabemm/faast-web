
module.exports = function(config) {
  config.set({

    browsers: ['PhantomJS'],

    frameworks: ['mocha', 'chai'],

    reporters: ['spec', 'coverage'],

    files: [
      // all files ending in 'test'
      './node_modules/phantomjs-polyfill/bind-polyfill.js',
      'test/index.js'
      // each file acts as entry point for the webpack configuration
    ],

    preprocessors: {
      // only specify one entry point
      // and require all tests in there
      'test/index.js': ['webpack']
    },

    coverageReporter: {

      dir: 'build/coverage/',
      reporters: [
          { type: 'html' },
          { type: 'text' },
          { type: 'text-summary' }
      ]
    },

    webpack: require('./webpack/test.config.js'),

    webpackMiddleware: {
      noInfo: true,
    },
  });
};
