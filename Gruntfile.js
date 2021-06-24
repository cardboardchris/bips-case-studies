module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch : {
        sassfile : {
            files : ['app-shared/assets/scss/*.scss'],
            tasks : ['sass'],
        },
        postcss : {
            files : ['app-shared/assets/css/src/style.css'],
            tasks : ['postcss']
        }
    },
    sass : {
        options : {
            sourcemap : false
        },
        dist : {
            files : {
                'app-shared/assets/css/src/style.css' : 'app-shared/assets/scss/style.scss'
            }
        }
    },
    autoprefixer : {
        options : {
            map : false
        },
        your_target: {
            // Target-specific file lists and/or options go here.
        },
    },
    postcss : {
        options : {
            map : false,
            processors : [
                require('autoprefixer')({
                    browsers : ['last 2 versions']
                })
            ]
        },
        dist : {
            src : 'app-shared/assets/css/src/style.css',
            dest : 'app-shared/assets/css/style.css'
        }
    },
    browserSync : {
        bsFiles : {
            src : [
                '*/*.html',
                '*/app/*.js',
                '*/app/views/*.html',
                '*/app/models/*.json',
                '*/*/*.html',
                '*/*/app/*.js',
                '*/*/app/views/*.html',
                '*/*/app/models/*.json',
                'app-shared/components/*.html',
                'app-shared/assets/css/*.css',
                'app-shared/assets/js/*.js'
            ]
        },
        options : {
            proxy : "http://localhost/learn.uncg.edu/courses/bips/case-studies/",
            watchTask : true,
            debugInfo : true
        }
    }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-browser-sync');

    grunt.registerTask("default", ['browserSync', 'watch']);

};