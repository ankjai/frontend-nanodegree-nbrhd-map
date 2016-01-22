module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        // js minification not working for es6
        // need to fig out how to use uglifyjs2
        concat: {
            dist: {
                src: 'src/javascripts/*.js',
                dest: 'dist/javascripts/app.js'
            }
        },
        cssmin: {
            minify: {
                src: 'src/css/main.css',
                dest: 'dist/css/main.min.css'
            }
        },
        jshint: {
            options: {
                'esversion': 6,
                'loopfunc': true
            },
            all: [
                'Gruntfile.js',
                'src/javascripts/*.js'
            ]
        },
        imagemin: {
            myTarget: {
                files: {
                    'dist/images/rsz_pin.png': 'src/images/rsz_pin.png'
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/index.html': 'src/index.html'
                }
            }
        }
    });

    grunt.registerTask('default', [
        'jshint',
        'concat',
        'cssmin',
        'imagemin',
        'htmlmin'
    ]);
};
