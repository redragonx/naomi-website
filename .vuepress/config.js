const fs = require ('fs-extra')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const HighlightDsl = require('./highlight-dsl')
const HighlightRules = require('./highlight-rules')

const base = process.env.N_DOCS_VERSION ? `/v${process.env.N_DOCS_VERSION}/` : '/'

module.exports = {
    title: 'Naomi',
    description: 'Naomi - an open source platform for developing always-on, voice-controlled applications',
    dest: 'Naomi-Website',
    host: 'localhost',
    base,
    ga: 'UA-130889564-1',
    shouldPrefetch: () => false,
    head: [
      ['link', { rel: 'stylesheet', href: `/fonts/fonts.css` }],
      ['link', { rel: 'icon', href: `/favicon.ico` }],
      ['link', { rel: 'shortcut icon', href: `/favicon.ico` }],
      ['link', { rel: 'apple-touch-icon', href: `/apple-icon.png` }],
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:image', content: '/naomi-logo.png' }],
    ],
    markdown: {
      config: (md) => {
        md.options.linkify = true
        const highlight = md.options.highlight
        md.options.highlight = (str, lang) => {
          /* Simple heuristics to detect rules & other Naomi DSL code snippets and override the language */
          if (str.match(/\b(?:Color|Contact|Dimmer|Group|Number|Player|Rollershutter|Switch|Location|Frame|Default|Text|Group|Selection|Setpoint|Slider|Colorpicker|Chart|Webview|Mapview|Image|Video|Item|Thing|Bridge|Time|Type|Sitemap|sitemap)\b/)) {
            lang = 'dsl'
          }
          if (str.match(/\b(?:String|DateTime)\b/) && lang !== 'java' && lang !== 'xml') {
            lang = 'dsl'
          }
          if ((str.match(/\brule\b/) && str.match(/\bwhen\b/) && str.match(/\bthen\b/) && str.match(/\bend\b/)) ||
            str.match(/received update/) || str.match(/changed.*(?:from|to)/) || str.match(/Channel.*triggered/) ||
            str.match(/\bval\b/) || str.match(/\bvar\b/) /* <-- dangerous! */) {
            
            if (lang !== 'nginx' && lang !== 'shell') lang = 'rules'
          }
          if (lang === 'shell' || lang === 'sh' || lang === 'shell_session') lang = 'bash'
          if (lang === 'conf') lang = 'dsl'
          if (lang === 'JSON') lang = 'json'
  
          if (!Prism.languages.dsl || !Prism.languages.rules) {
            Prism.languages.dsl = HighlightDsl
            Prism.languages.rules = HighlightRules
          }
  
          return highlight(str, lang)
        }
      }
    },
    configureWebpack: (config, isServer) => {
      config.plugins.push(new CopyWebpackPlugin([
        { from: '.vuepress/_redirects', to: '.'},
        { from: '.vuepress/_headers', to: '.'},
      ]))
    },
    serviceWorker: false,
    themeConfig: {
      logo: '/naomi-logo.png',
      // repo: 'projectnaomi',
      editLinks: false,
      activeHeaderLinks: false,
      sidebarDepth: 0,
      docsDir: 'docs',
      search: true,
      searchMaxSuggestions: 10,
      nav: [
        {
          text: 'Download',
          link: '/download/',
        },
        {
          text: 'Documentation',
          link: '/docs/',
        },
        {
          text: 'Support',
          link: '/support/',
        },
        {
          text: 'About',
          items: [
            {
              text: 'Get Involved',
              items: [
                {
                  text: 'Who We Are',
                  link: '/about/who-we-are',
                },
                {
                  text: 'Contribute',
                  link: '/about/contributing'
                },
              ]
            },
            {
              text: 'Resources',
              items: [
                {
                  text: 'Privacy Policy',
                  link: '/privacy'
                },
              ]
            }
          ]
        },
        {
          text: 'Support Naomi',
          link: '/support-naomi/#Sponsor-Naomi',
          items: [
            {
              text: 'One-time Donations',
              link: '/support-naomi/#Sponsor-Naomi'
            },
            {
              text: 'Recurring Pledges',
              link: '/support-naomi/#Recurring-Pledges'
            },
//            {
//                text: 'Foundation',
//                link: 'https://foundation.projectnaomi.com/'
//            },
          ]
        },
        {
          text: 'GitHub',
          link: 'https://github.com/naomiproject',
        }
      ],
      sidebar: {
        '/docs/': [
          {
            title: 'Welcome to Naomi',
            collapsable: false,
            children: [
              ''
            ]
          },
          {
            title: 'Installation Guide',
            collapsable: false,
            children: [
              'installation/',
              ['installation/linux', 'Linux'],
              ['installation/windows', 'Windows'],
              ['installation/macos', 'macOS'],
              'installation/rasppi',
              'installation/naobian',
              /*'installation/pine',
              'installation/docker',
              'installation/synology',
              'installation/qnap',
              ['installation/security', 'Security']*/
            ]
          },
          {
            title: 'Configuration Guide',
            collapsable: false,
            children: [
              ['configuration/', 'Configuration Overview'],
              'configuration/audio',
              'configuration/tts',
              'configuration/stt',
              'configuration/profile',
              'configuration/plugins',
            ]
          },
          {
            title: 'Plugins',
            collapsable: false,
            children: [
              'plugins/marytts-server',
              'plugins/pocketsphinx-install',
              'plugins/deepspeech-setup'
            ]
          },
          {
            title: 'Developer Guide',
            collapsable: false,
            children: [
              ['developer/', 'Development Overview'],
              'developer/contributing/contributing'
            ]
          }
        ],
        '/dev/docs/': [
          {
            title: 'Welcome to Naomi',
            collapsable: false,
            children: [
              ''
            ]
          },
          {
            title: 'Installation Guide',
            collapsable: false,
            children: [
              'installation/',
              ['installation/linux', 'Linux'],
              ['installation/windows', 'Windows'],
              ['installation/macos', 'macOS'],
              'installation/rasppi',
              'installation/naobian',
              /*'installation/pine',
              'installation/docker',
              'installation/synology',
              'installation/qnap',
              ['installation/security', 'Security']*/
            ]
          },
          {
            title: 'Configuration Guide',
            collapsable: false,
            children: [
              ['configuration/', 'Configuration Overview'],
              'configuration/audio',
              'configuration/tts',
              'configuration/stt',
              'configuration/vad',
              'configuration/profile',
              'configuration/plugins',
            ]
          },
          {
            title: 'Plugins',
            collapsable: false,
            children: [
              'plugins/marytts-server',
              'plugins/pocketsphinx-install',
              'plugins/deepspeech-setup'
            ]
          },
          {
            title: 'Developer Guide',
            collapsable: false,
            children: [
              ['developer/', 'Development Overview'],
              'developer/contributing/contributing',
              'developer/plugins/',
              'developer/plugins/audioengine_plugin',
              'developer/plugins/speechhandler_plugin',
              'developer/plugins/tti_plugin',
              'developer/plugins/tts_plugin',
            ]
          }
        ]
      },
    }
  }
  