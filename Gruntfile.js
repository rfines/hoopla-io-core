module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    coffee: {
      compile: {
        files: {
          'temp/scripts/temp.js': 'src/**/*.coffee' 
        },
        options: {
          basePath: 'src'
        }
      }
    },     
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['temp/**/*.js'],
        dest: 'hoopla-io-core.js'
      }
    },
    clean : ["temp"],
    simplemocha: {
      options: {
        globals: ["should"],
        timeout: 3000,
        ignoreLeaks: false,
        ui: "bdd",
        reporter: "spec",
        compiler: "coffee-script"
      },
      all: {
        src: ["test/**/*.coffee"]
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks("grunt-simple-mocha");

  grunt.registerTask('default', ['coffee', 'concat', 'clean']);
  grunt.registerTask("test", "simplemocha");
};