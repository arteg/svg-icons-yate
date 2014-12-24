'use strict';

var through = require('through2');
var PluginError = require('gulp-util').PluginError;
var yate = require('yate');
var lodash = require('lodash');



var PLUGIN_NAME = 'gulp-yate';



function GulpYate(options) {
    options = options || {};
    // запрещенные параметры, чтобы ничто не приходило извне таска и не выходило за границы таска
    options = lodash.omit(options, ['print', 'output', 'import']);

    return through.obj(function(file, enc, cb) {
        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported!'));
            return cb();
        }

        try {
            var compiled = yate.compile(file.path, options);
        } catch (e) {
            this.emit('error', new PluginError(PLUGIN_NAME, e));
            return cb();
        }

        // content может быть стримом или буфером
        file.contents = new Buffer(compiled.js);

        // меняем расширение на js
        file.path = file.path.split('.').slice(0, -1).concat('js').join('.');

        this.push(file);
        cb();
    });
}



module.exports = exports = GulpYate;
