module.exports = function(grunt) {
  grunt.initConfig({
    haml: {
      dev: {
        options: {
          bundleExec: true,
					format: 'html5',
					encoding: 'utf-8',
					style: 'expanded', 				// expanded || nested || compact || compressed
        },
        files: {
					'01 - Flexbox/index.html': '01 - Flexbox/src/index.haml',
        }
      },
			dist: {
        options: {
          bundleExec: true,
					format: 'html5',
					encoding: 'utf-8',
					style: 'compressed',
        },
        files: {
					'00 - Basics/index.html': '00 - Basics/src/index.haml',
          '01 - Flexbox/index.html': '01 - Flexbox/src/index.haml',
					'02 - Slice/index.html': '02 - Slice/src/index.haml',
					'03 - Categories/index.html': '03 - Categories/src/index.haml',
					'04 - Unsplash/index.html': '04 - Unsplash/src/index.haml',
        }
      }
    },
		sass: {
			options: {
				sourcemap: false, 					// No sourcemap as postcss will generate one instead
			},
			dev: {
				options: {
					outputStyle: 'expanded',
				},
				files: {
					'01 - Flexbox/main.css': '01 - Flexbox/src/main.scss',
				}
			},
	    dist: {
	      options: {
	        outputStyle: 'compressed',
	      },
	      files: {
	        '01 - Flexbox/main.css': '01 - Flexbox/src/main.scss',
	        '02 - Slice/main.css': '02 - Slice/src/main.scss',
					'03 - Categories/main.css': '03 - Categories/src/main.scss',
					'04 - Unsplash/main.css': '04 - Unsplash/src/main.scss',
	      }
	    }
	  },
		postcss: {
			dev: {
				options: {
		      map: false, 																							// Inline sourcemaps
		    },
				src: '01 - Flexbox/main.css',
			},
	    dist: {
				options: {
		      map: true, 																								// Inline sourcemaps
		      processors: [
		        require('pixrem')(), 																		// Add fallbacks for rem units
						require('cssnext')(),																		// Enables future syntax
		        require('autoprefixer')(																// Adds vendor prefixes
							{browsers: 'last 5 versions'}
						),
						require("postcss-color-rgba-fallback")(),								// Adds a hexcode fallback
		        require('cssnano')( 																		// Minify the result
							{calc: {precision: 2}},
							{discardComments: {removeAll: true}}
						),
		      ]
		    },
				files: [
					{src: '01 - Flexbox/main.css', dest: '01 - Flexbox/main.min.css'},
        	{src: '02 - Slice/main.css', dest: '02 - Slice/main.min.css'},
					{src: '03 - Categories/main.css', dest: '03 - Categories/main.min.css'},
        	{src: '04 - Unsplash/main.css', dest: '04 - Unsplash/main.min.css'},
				]
	    }
	  },
		babel: {
	    options: {
        sourceMap: 'inline',
				compact: 'auto',
        presets: ['es2015'],
				minified: true,
	    },
	    dist: {
        files: {
					'03 - Categories/main.js': '03 - Categories/src/main.es6',
					'04 - Unsplash/main.js': '04 - Unsplash/src/main.es6',
        }
	    }
    },
		responsive_images: {
			dist: {
				options: {
					engine: "gm",								// gm = GraphicsMagick || im = ImageMagick
					concurrency: 3,							// Number of cores used to transform images
					aspectRatio: false,					// Enables cropping
					sizes: [{
						name: 'medium',						// Name of the output folder created in /img/compressed/
						width: 640,
						height: 640,
					}]
				},
				files: [{
					expand: true,
					cwd: 'img/src/',
					src: ['**.{jpg,gif,png}'],
					custom_dest: 'img/compressed/{%= name %}/',
					ext: '.min.jpg',
				}]
			}
	  },
		imagemin: {                          									// Task
			options: {                       										// Target options
        optimizationLevel: 3,															// 0-7
        svgoPlugins: [{ removeViewBox: false }],
      },
			dist: {
				files: [{
					expand: true,																		// Enable dynamic expansion
					cwd: 'img/compressed/',													// Src matches are relative to this path
	        src: ['**/**.{jpg,gif,png}'],										// Actual patterns to match
	        dest: 'img/compressed/',												// Destination path prefix
	        ext: '.min.jpg',																// Output suffix
				}]
			}
	  },
		clean: {
			img: [
				'img/**/*',
				'!img/compressed/**',
				'!img/src/**',
			],
			css: [
				'01 - Flexbox/**.css',
				'02 - Slice/**.css',
				'03 - Categories/**.css',
				'04 - Unsplash/**.css',
				'!**/*.min.css',
			],
			projects: [
				'index.html',
				'img/**/*',
				'!img/src/**',
				'01 - Flexbox/**.{html,css,js}',
				'02 - Slice/**.{html,css,js}',
				'03 - Categories/**.{html,css,js}',
				'04 - Unsplash/**.{html,css,js}',
			]
		},
		notify: {
			dev: {
				options: {
					title: 'Task Complete',
					message: 'Development files successfully compiled!',
				}
			},
			haml: {
				options: {
					title: 'Task Complete',
					message: 'Successfully compiled HAML!',
				}
			},
			css: {
				options: {
					title: 'Task Complete',
					message: 'Successfully compiled SCSS and ran PostCSS!',
				}
			},
			img: {
				options: {
					title: 'Task Complete',
					message: 'Successfully cropped, resized and minified images!',
				}
			},
			clean: {
				options: {
					title: 'Task Complete',
					message: 'Successfully cleared project directories!',
				}
			}
		}
  });

	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-haml2html');
	grunt.loadNpmTasks('grunt-postcss');
	grunt.loadNpmTasks('grunt-notify');
	grunt.loadNpmTasks('grunt-babel');
	grunt.loadNpmTasks('grunt-sass');

	// Build for production
  grunt.registerTask('default', [
		'haml:dist',
		'notify:haml',
		'sass:dist',
		'postcss:dist',
		'clean:css',
		'notify:css',
		'babel'
	]);

	// build for development
  grunt.registerTask('dev', [
		'haml:dev',
		'notify:dev']);

	// Image optimization
	grunt.registerTask('img', [
		'responsive_images:dist',
		'imagemin:dist',
		'notify:img'
	]);

	// Clear projects
	grunt.registerTask('clear', [
		'clean:projects',
		'notify:clean'
	]);
};
