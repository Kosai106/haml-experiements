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
					'index.html': 'index.haml',
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
          '01 - Flexbox/index.html': '01 - Flexbox/src/index.haml',
					'02 - Slice/index.html': '02 - Slice/src/index.haml',
					'03 - Categories/index.html': '03 - Categories/src/index.haml',
					'04 - Unsplash/index.html': '04 - Unsplash/src/index.haml',
					'05 - Sticky/index.html': '05 - Sticky/src/index.haml',
        }
      }
    },
		sass: {
			options: {
				sourcemap: false, 					// no sourcemap as postcss will generate one instead
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
					'05 - Sticky/main.css': '05 - Sticky/src/main.scss',
	      }
	    }
	  },
		postcss: {
			options: {
				processors: [
					require('pixrem')(), 																			// add fallbacks for rem units
					require('autoprefixer')({browsers: 'last 5 versions'}), 	// add vendor prefixes
				]
			},
			dev: {
				options: {
		      map: false, 																							// inline sourcemaps
		    },
				src: '01 - Flexbox/main.css',
			},
	    dist: {
				options: {
		      map: true, 																								// inline sourcemaps
		      processors: [
		        require('pixrem')(), 																		// add fallbacks for rem units
		        require('autoprefixer')({browsers: 'last 5 versions'}), // add vendor prefixes
		        require('cssnano')(), 																	// minify the result
		      ]
		    },
	      src: '**/main.css',
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
          '05 - Sticky/main.js': '05 - Sticky/src/main.es6',
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
					src: ['**.{jpg,gif,png}'],
					cwd: 'img/src/',
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
	        src: ['**/**.{jpg,gif,png}'],										// Actual patterns to match
					cwd: 'img/compressed/',													// Src matches are relative to this path
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
			projects: [
				'index.html',
				'img/**/*',
				'!img/src/**',
				'01 - Flexbox/**.{html,css,js}',
				'02 - Slice/**.{html,css,js}',
				'03 - Categories/**.{html,css,js}',
				'04 - Unsplash/**.{html,css,js}',
				'05 - Sticky/**.{html,css,js}',
			]
		}
  });

	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-haml2html');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-postcss');
	grunt.loadNpmTasks('grunt-babel');

	// Build for production
  grunt.registerTask('default', ['haml:dist', 'sass:dist', 'postcss:dist', 'babel']);

	// build for development
  grunt.registerTask('dev', ['haml:dev']);

	// Image optimization
	grunt.registerTask('img', ['responsive_images:dist', 'imagemin:dist']);

	// Clear projects
	grunt.registerTask('clear', ['clean:projects']);
};
