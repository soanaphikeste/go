var fs = require("fs");

module.exports = function(grunt) {
	grunt.registerTask("config", function() {
		var done = this.async();
		fs.exists("config.json", function(f) {
			if(!f) {
				var config = {
					ports: {
						webserver: 8080,
						websocket: 8081
					},
					webserver: true,
					webroot: "./www"
				};
				fs.writeFile("config.json", JSON.stringify(config, null, '\t'), function(){
					grunt.log.writeln("No configurationfile found. Created standard-config. You might want to edit it according to your needs and rerun grunt.");
					grunt.fail.warn("Aborting.");
				});
			}
			else {
				done();
			}
		});
	});
	grunt.registerTask("initconfig", function() {
		grunt.initConfig({
			pkg: grunt.file.readJSON("package.json"),
			config: grunt.file.readJSON("config.json"),
			concat: {
				options: {
					seperator: ";"
				},
				dist: {
					src: ["client/*.js"],
					dest: "<%= config.webroot %>/<%= pkg.name %>.js"
				}
			},
			uglify: {
				options: {
					banner: "/*! <%= pkg.name %> <%= grunt.template.today('dd-mm-yyyy') %> */\n",
					sourceMap: "<%= pkg.name %>.map"
				},
				dist: {
					files: {
						'<%= config.webroot %>/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
					}
				}
			},
			less: {
				development: {
					options: {
						paths: ["client"]
					},
					files: {
						"<%= config.webroot %>/style.css": "client/style.less"
					}
				},
				production: {
					options: {
						paths: ["client"],
						cleancss: true
					},
					files: {
						"<%= config.webroot %>/style.css": "client/style.less"
					}
				}
			},
			copy: {
				sources: {
					files: [
						{
							expand: true, 
							src: ["*.html", "templates/*.html"],
							dest: "<%= config.webroot %>/",
							cwd: "client/",
							filter: "isFile"
						}
					]
				}
			}
		});
	});
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.registerTask("default", [
		"config",
		"initconfig",
		"concat",
		"uglify",
		"less",
		"copy"
	]);
};
