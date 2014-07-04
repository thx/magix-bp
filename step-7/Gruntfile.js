/**
 * magix 项目打包脚本
 */
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        magix: {
            build: {
                //magix view 所在的入口文件夹路径
                src: './src/',
                //处理后文件夹的路径
                dest: './build/'
            },
            options: {
                //压缩级别
                compress: 'normal',
                //中文转化unicode
                c2u: false,
                //view对应模板字段的key
                tmplKey: 'tmpl'
            }
        }
    });
    grunt.loadNpmTasks('magix-app-build');
    grunt.registerTask('default', ['magix']);
};