Package.describe({
  name: 'cultofcoders:grapher-live',
  version: '1.3.0',
  // Brief, one-line summary of the package.
  summary: 'Grapher Live - Visualize your queries in the browser',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/cult-of-coders/grapher-live',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Npm.depends({
    'lodash.clonedeep': '4.5.0',
});

Package.onUse(function(api) {
  api.versionsFrom('1.3');
  api.use('ecmascript');
  api.use('tmeasday:check-npm-versions@0.3.1');
  api.use('react-meteor-data@0.2.15');
  api.use('cultofcoders:grapher@1.3.0');
  api.use('cultofcoders:grapher-react@0.1.1');
  api.use('less');
  api.imply('react-meteor-data@0.2.15');

  api.mainModule('main.client.js', 'client');
  api.mainModule('main.server.js', 'server');
});

Package.onTest(function(api) {
});
