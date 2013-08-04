module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    shell: {
      initialize: {
        command: [
          'pg_ctl -D /usr/local/var/postgres -l logfile start',
          'python ~/dev/me/django/miniProject/manage.py runserver'
        ].join('&&')
      },
      'jade2js': {
        command: 'coffee ../../utils/jade2js/jade2js.coffee -R'
      }
    },

    requirejs: {
      compile: {
        options: {
          appDir: "scripts",
          baseUrl: ".",
          dir: "build",
          mainConfigFile: "scripts/common-build.js",
          optimize: "uglify2",
          skipDirOptimize: false,
          removeCombined: true,
          paths: {
            jquery: "lib/jquery",
            underscore: "lib/lodash.custom",
            backbone: "lib/backbone",
            typeahead: "lib/typeahead",
            jade: "lib/jade-runtime"
          },
          modules: [{
              name: "common-build",
              include: [
                "jquery",
                "underscore",
                "backbone",
                "typeahead",
                "jade",
                "base-main",
                "apps/rand-quot-app"
              ]
            }, {
              name: "selection-main",
              exclude: ["common-build"]
            }, {
              name: "only-highlight-main",
              exclude: ["common-build"]
            }, {
              name: "tag-main",
              exclude: ["common-build"]
            }, {
              name: "browse-main",
              exclude: ["common-build"]
            }, {
              name: "timeline-main",
              exclude: ["common-build"]
            }, {
              name: "browse-highlights-main",
              exclude: ["common-build"]
            }, {
              name: "about-main",
              exclude: ["common-build"]
            }

          ]
        }
      }
    },

    replace: {
      dev: {
        src: ['../../templates/jade/*.jade', '../../templates/jade/includes/*.jade'],
        overwrite: true,
        replacements: [{
          from: /grunt-active: build -->([\s\S]*?)<!-- endgrunt/,
          to: 'grunt-inactive: build$1endgrunt'
        }, {
          from: /grunt-inactive: dev([\s\S]*?)endgrunt/,
          to: 'grunt-active: dev -->$1<!-- endgrunt'
        }]
      },
      build: {
        src: ['../../templates/jade/*.jade', '../../templates/jade/includes/*.jade'],
        overwrite: true,
        replacements: [{
          from: /grunt-active: dev -->([\s\S]*?)<!-- endgrunt/,
          to: 'grunt-inactive: dev$1endgrunt'
        }, {
          from: /grunt-inactive: build([\s\S]*?)endgrunt/,
          to: 'grunt-active: build -->$1<!-- endgrunt'
        }]
      }
    },

    jade: {
      process: {
        files: [{
          expand: true,
          flatten: true,
          src: ['../../templates/jade/*.jade'],
          dest: '../../templates/',
          ext: '.html'
        }]
      }
    },

    sass: {
      options: {
        debugInfo: false,
        noCache: true
      },
      dev: {
        options: {
          style: "expanded",
          sourcemap: true
        },
        files: {
          'style/css/STYLE.css': 'style/sass/STYLE.sass'
        }
      },
      build: {
        options: {
          style: "compressed"
        },
        files: {
          'style/css/style-compressed.css': 'style/sass/STYLE.sass'
        }
      }
    },

    grunticon: {
      icons: {
        options: {
          src: 'images/svg-assets/',
          dest: 'style/sass/svg/',
          datasvgcss: '_icons-svg.scss'
        }
      }
    },

    coffee : {
      options: {
        bare: true
      },
      compile: {
        expand: true,
        cwd: 'coffee',
        src: ['*.coffee', '**/*.coffee'],
        dest: 'scripts',
        ext: '.js'
      }
    },

    watch: {
      livereload: {
        options: {
          livereload: true
        },
        files: [
          'style/css/STYLE.css',
          '../../templates/*.html',
          'scripts/*.js',
          'scripts/**/*.js'
        ]
      },
      jade: {
        files: [
          '../../templates/jade/*',
          '../../templates/jade/**/*.jade'
        ],
        tasks: ['jade:process']
      },
      sass: {
        files: 'style/sass/*',
        tasks: ['sass:dev']
      },
      icons: {
        livereload: {
          options: true
        },
        files: 'images/svg-assets/*.svg',
        tasks: ['grunticon:icons']
      },
      coffee: {
        files: [
          '*.coffee',
          '**/*.coffee'
        ],
        tasks: ['coffee:compile']
      }
    }

  });

  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-grunticon');

  grunt.registerTask('start', ['shell:initialize']);
  grunt.registerTask('sprite', ['shell:generate-sprite', 'replace:sprite-extend']);
  grunt.registerTask('jade2js', ['shell:jade2js']);
  grunt.registerTask('dev', ['replace:dev', 'jade:process']);
  grunt.registerTask('build', ['requirejs:compile', 'replace:build', 'jade:process', 'sass:build']);

};