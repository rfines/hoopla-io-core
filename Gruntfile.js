module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    coffee: {
      compile: {
        files: {
          'temp/scripts/*.js': 'src/**/*.coffee' 
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
        dest: 'index.js'
      }
    },
    clean : ["temp"]
  });
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', ['coffee', 'concat', 'clean']);

};