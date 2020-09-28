'use strict';

// choosing node-sass as requirement
const sass = require('node-sass');

module.exports = function(grunt){
	// stats
	require('time-grunt')(grunt);

	// load appropriate packages
	require('jit-grunt')(grunt);
	
	//task config
	grunt.initConfig({
		
		sass:{
			options: {
            implementation: sass,
            sourceMap: false
        	},
			dist:{
				files:{
					'css/styles_scss.css' : 'css/styles_scss.scss'
				}
			}
		},
		
		watch:{
			files: 'css/*.scss',
			tasks: ['sass']
		},
		
		browserSync:{
			dev:{
				bsFiles:{
					src:[
						'css/*.css',
						'*.html',
						'js/*.js'
					]
				}
			},
			options:{
				watchTask:true,
				server:{
					baseDir:'./'
				}
			}

		},
		
		copy:{
			html:{
				files:[{
					expand:true,
					dot: true,
					cwd: './',
					src: ['*.html'],
					dest: 'dist'
				}]
			},
			fonts:{
				files:[{
					expand:true,
					dot:true,
					cwd: 'node_modules/font-awesome',
					src:['fonts/*.*'],
					dest:'dist'
				}]
			}
		},
		
		clean:{
			build:{
				src:['dist/']
			}
		},

		imagemin:{
			dnynamic:{
				files:[{
					expand:true,
					cwd:'./',
					src:['img/*.{png,jpg,gif}']
					dest:'dist/'
				}]
			}
		},

		useminPrepare: {
            foo: {
                dest: 'dist',
                src: ['contactus.html','aboutus.html','index.html']
            },
            options: {
                flow: {
                    steps: {
                        css: ['cssmin'],
                        js:['uglify']
                    },
                    post: {
                        css: [{
                            name: 'cssmin',
                            createConfig: function (context, block) {
                            var generated = context.options.generated;
                                generated.options = {
                                    keepSpecialComments: 0, rebase: false
                                };
                            }       
                        }]
                    }
                }
            }
        },

        // Concat
        concat: {
            options: {
                separator: ';'
            },
  
            // dist configuration is provided by useminPrepare
            dist: {}
        },

        // Uglify
        uglify: {
            // dist configuration is provided by useminPrepare
            dist: {}
        },

        cssmin: {
            dist: {}
        },

        // Filerev
        filerev: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 20
            },
  
            release: {
            // filerev:release hashes(md5) all assets (images, js and css )
            // in dist directory
                files: [{
                    src: [
                        'dist/js/*.js',
                        'dist/css/*.css',
                    ]
                }]
            }
        },
  
        // Usemin
        // Replaces all assets with their revved version in html and css files.
        // options.assetDirs contains the directories for finding the assets
        // according to their relative paths
        usemin: {
            html: ['dist/contactus.html','dist/aboutus.html','dist/index.html'],
            options: {
                assetsDirs: ['dist', 'dist/css','dist/js']
            }
        }
    });

    grunt.registerTask('css', ['sass']);
    grunt.registerTask('default', ['browserSync', 'watch']);
    grunt.registerTask('build', [
        'clean',
        'copy',
        'imagemin',
        'useminPrepare',
        'concat',
        'cssmin',
        'uglify',
        'filerev',
        'usemin'
    ]);
};