module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
    
		// minifies JS
		uglify: {
			options: {
				mangle: false,
				preserveComments: false
			},
			my_target: {
				files: [{
					expand: true,
					cwd: 'src/js',
					src: ['*.js','!*.min.js','vendor/*.js','!vendor/*.min.js'],
					dest: 'dist/js',
					ext: '.min.js'
				}]
			}
		},
			
		// minifies CSS files
		cssmin: {
			options: {              	
              	rebase: false
          	},          	
			minify: {
				files: [{
					expand: true,
					cwd: 'src/css',
					src: ['*.css', '!*.min.css','vendor/*.css','!vendor/*.min.css'],
					dest: 'dist/css',
					ext: '.min.css'
				}]
			}
		},
		
		// js validation
		jshint: {
			all: ['src/js/*.js']
		},
		
		// image compression
		imagemin: {                          
			dist: {
				options: {
					optimizationLevel: 3
				},
				files: [{
					expand: true,
					cwd: 'src/img',
					src: ['**/*.{png,jpg}'],
					dest: 'dist/img/'
				}]
			}
		},
		
		// watch task
		browserSync: {
			bsFiles: {
				src : ['src/*.html','src/css/*.css','src/js/*.js']
			},
			options: {
				server: {
					baseDir: "./"
				},
				ghostMode: 
				{
					clicks: true,
					forms: true,
					scroll: true
				}
			}
		},
		
		// modifies html to use minified js
		processhtml: {		
			dist: {
				options: {
					process: true,
				},
				files: [{
					expand: true,
					cwd: 'src/',
					src: ['*.html'],
					dest: 'dist/'	
				}]
			}
		},
		
		// copy job for fonts
		copy: {
			main: {
				files: [					
					{expand: true, cwd: 'src/font/', src: ['**'], dest: 'dist/font'},		
					{expand: true, cwd: 'src/js/vendor/', src: ['**.min.js'], dest: 'dist/js/vendor'}
				]
			}
		},

		// modifies js files to reference min.js files
		'string-replace': {
			dist: {
				files: {
					'dist/sw.js': 'src/sw.js'
				},
				options: {
					replacements: [
						{
							pattern: '/src/index.html',
							replacement: '/dist/index.html'
						},						
						{
							pattern: '/src/css/style.css',
							replacement: '/dist/css/style.min.css'
						},
						{
							pattern: '/src/css/vendor/animate.css',
							replacement: '/dist/css/vendor/animate.min.css'
						},
						{
							pattern: '/src/css/vendor/bootstrap-material-datetimepicker.css',
							replacement: '/dist/css/vendor/bootstrap-material-datetimepicker.min.css'
						},
						{
							pattern: '/src/css/vendor/materialize.css',
							replacement: '/dist/css/vendor/materialize.min.css'
						},
						{
							pattern: '/src/js/constants.js',
							replacement: '/dist/js/constants.min.js'
						},
						{
							pattern: '/src/js/index.js',
							replacement: '/dist/js/index.min.js'
						},
						{
							pattern: '/src/js/schedules.js',
							replacement: '/dist/js/schedules.min.js'
						},
						{
							pattern: '/src/js/stations.js',
							replacement: '/dist/js/stations.min.js'
						},
						{
							pattern: '/src/js/validation.js',
							replacement: '/dist/js/validation.min.js'
						},
						{
							pattern: '/src/js/vendor/bootstrap-material-datetimepicker.js',
							replacement: '/dist/js/vendor/bootstrap-material-datetimepicker.min.js'
						},
						{
							pattern: '/src/js/vendor/idb.js',
							replacement: '/dist/js/vendor/idb.min.js'
						},
						{
							pattern: '/src/js/vendor/xml2json.js',
							replacement: '/dist/js/vendor/xml2json.min.js'
						},
						{
							pattern: '/src/',
							replacement: '/dist/'
						},
						{
							pattern: '/src/font/material-design-icons/MaterialIcons-Regular.eot',
							replacement: '/dist/font/material-design-icons/MaterialIcons-Regular.eot'
						},
						{
							pattern: '/src/font/material-design-icons/MaterialIcons-Regular.woff2',
							replacement: '/dist/font/material-design-icons/MaterialIcons-Regular.woff2'
						},
						{
							pattern: '/src/font/material-design-icons/MaterialIcons-Regular.woff',
							replacement: '/dist/font/material-design-icons/MaterialIcons-Regular.woff'
						},
						{
							pattern: '/src/font/material-design-icons/MaterialIcons-Regular.ttf',
							replacement: '/dist/font/material-design-icons/MaterialIcons-Regular.ttf'
						},
						{
							pattern: '/src/font/roboto/Roboto-Bold.ttf',
							replacement: '/dist/font/roboto/Roboto-Bold.ttf'
						},
						{
							pattern: '/src/font/roboto/Roboto-Thin.ttf',
							replacement: '/dist/font/roboto/Roboto-Thin.ttf'
						},
						{
							pattern: '/src/font/roboto/Roboto-Regular.ttf',
							replacement: '/dist/font/roboto/Roboto-Regular.ttf'
						},
						{
							pattern: '/src/js/vendor/jquery-2.1.1.min.js',
							replacement: '/dist/js/vendor/jquery-2.1.1.min.js'
						},
						{
							pattern: '/src/js/vendor/materialize.js',
							replacement: '/dist/js/vendor/materialize.min.js'
						},
						{
							pattern: '/src/js/vendor/moment.min.js',
							replacement: '/dist/js/vendor/moment.min.js'
						},
						{
							pattern: '/src/img/background.jpg',
							replacement: '/dist/img/background.jpg'
						}
					]
				}
			}
		}
	});	

	// development tasks
	grunt.registerTask('dev', ['browserSync']);
	
	// production tasks
	grunt.registerTask('release', ['jshint','string-replace','uglify','cssmin','imagemin','processhtml','copy','browserSync']);

	// load tasks 
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-copy');	
	grunt.loadNpmTasks('grunt-browser-sync');
	grunt.loadNpmTasks('grunt-processhtml');	
	grunt.loadNpmTasks('grunt-string-replace');	
};