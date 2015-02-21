
require('./services/index');
require('./controllers/inbox');
require('./filters/index');

(function () {

  'use strict';

  var app = angular.module('inboxApp', [
    'ipCookie',
    'ngRoute',
    'ngAnimate',
    'ui.router',
    'inboxFilters',
    'inboxControllers',
    'inboxServices',
    'pascalprecht.translate',
    'nvd3ChartDirectives',
    'angularFileUpload'
  ]);

  app.config(['$stateProvider', '$urlRouterProvider', '$translateProvider', '$compileProvider',
    function($stateProvider, $urlRouterProvider, $translateProvider, $compileProvider) {

      $stateProvider
        // messages
        .state('messages', {
          url: '/messages?tour',
          controller: 'MessagesCtrl',
          templateUrl: 'templates/partials/messages.html'
        })
        .state('messages.detail', {
          url: '/:id',
          views: {
            content: {
              controller: 'MessagesContentCtrl',
              templateUrl: 'templates/partials/messages_content.html'
            }
          }
        })

        // reports
        .state('reports', {
          url: '/reports?tour&query',
          controller: 'ReportsCtrl',
          templateUrl: 'templates/partials/reports.html'
        })
        .state('reports.detail', {
          url: '/:id',
          views: {
            content: {
              controller: 'ReportsContentCtrl',
              templateUrl: 'templates/partials/reports_content.html'
            }
          }
        })

        // analytics
        .state('analytics', {
          url: '/analytics/:module?tour',
          controller: 'AnalyticsCtrl',
          templateUrl: 'templates/partials/analytics.html'
        })

        // configuration
        .state('configuration', {
          url: '/configuration',
          controller: 'ConfigurationCtrl',
          templateUrl: 'templates/partials/configuration.html'
        })
        .state('configuration.settings', {
          url: '/settings',
          views: {
            content: {
              templateUrl: 'templates/partials/configuration_settings.html'
            }
          }
        })
        .state('configuration.settings.basic', {
          url: '/basic',
          views: {
            tab: {
              controller: 'ConfigurationSettingsBasicCtrl',
              templateUrl: 'templates/partials/configuration_settings_basic.html'
            }
          }
        })
        .state('configuration.settings.advanced', {
          url: '/advanced',
          views: {
            tab: {
              controller: 'ConfigurationSettingsAdvancedCtrl',
              templateUrl: 'templates/partials/configuration_settings_advanced.html'
            }
          }
        })
        .state('configuration.translation', {
          url: '/translation',
          views: {
            content: {
              templateUrl: 'templates/partials/configuration_translation.html'
            }
          }
        })
        .state('configuration.translation.languages', {
          url: '/languages',
          views: {
            tab: {
              controller: 'ConfigurationTranslationLanguagesCtrl',
              templateUrl: 'templates/partials/configuration_translation_languages.html'
            }
          }
        })
        .state('configuration.translation.application', {
          url: '/application',
          views: {
            tab: {
              controller: 'ConfigurationTranslationApplicationCtrl',
              templateUrl: 'templates/partials/configuration_translation_application.html'
            }
          }
        })
        .state('configuration.translation.messages', {
          url: '/messages',
          views: {
            tab: {
              controller: 'ConfigurationTranslationMessagesCtrl',
              templateUrl: 'templates/partials/configuration_translation_messages.html'
            }
          }
        })
        .state('configuration.forms', {
          url: '/forms',
          views: {
            content: {
              controller: 'ConfigurationFormsCtrl',
              templateUrl: 'templates/partials/configuration_forms.html'
            }
          }
        })
        .state('configuration.users', {
          url: '/users',
          views: {
            content: {
              controller: 'ConfigurationUsersCtrl',
              templateUrl: 'templates/partials/configuration_users.html'
            }
          }
        })
        .state('configuration.export', {
          url: '/export',
          views: {
            content: {
              controller: 'ConfigurationExportCtrl',
              templateUrl: 'templates/partials/configuration_export.html'
            }
          }
        })

        // help
        .state('help', {
          url: '/help',
          controller: 'HelpCtrl',
          templateUrl: 'templates/partials/help.html'
        })
        .state('help.search', {
          url: '/search',
          views: {
            content: {
              controller: 'HelpSearchCtrl',
              templateUrl: 'templates/partials/help_search.html'
            }
          }
        })
        .state('help.validation', {
          url: '/validation',
          views: {
            content: {
              templateUrl: 'templates/partials/help_validation.html'
            }
          }
        })
        .state('help.messages', {
          url: '/messages',
          views: {
            content: {
              templateUrl: 'templates/partials/help_messages.html'
            }
          }
        })
        .state('help.export', {
          url: '/export',
          views: {
            content: {
              templateUrl: 'templates/partials/help_export.html'
            }
          }
        })

        // theme design testing page
        .state('theme', {
          url: '/theme',
          controller: 'ThemeCtrl',
          templateUrl: 'templates/partials/theme.html'
        });

      $urlRouterProvider.when('', '/messages');
      $translateProvider.useLoader('SettingsLoader', {});
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
    }
  ]);

  app.factory('SettingsLoader', ['$q', 'Settings', function ($q, Settings) {
    return function (options) {

      var deferred = $q.defer();

      Settings(function(err, res) {
        if (err) {
          return deferred.reject(err);
        }

        options.key = options.key || res.locale || 'en';

        var test = false;
        if (options.key === 'test') {
          options.key = 'en';
          test = true;
        }

        var data = {};
        if (res.translations) {
          res.translations.forEach(function(translation) {
            var key = translation.key;
            var value = translation.default || key;
            translation.translations.forEach(function(val) {
              if (val.locale === options.key) {
                value = val.content;
              }
            });
            if (test) {
              value = '-' + value + '-';
            }
            data[key] = value;
          });
        }
        deferred.resolve(data);
      });
      
      return deferred.promise;
    };
  }]);
  
}());

