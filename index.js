var through = require('through2'),
    gutil = require('gulp-util'),
    path = require('path'),
    fs = require('fs'),

    resources = require('./libs/resources');

module.exports = function (opts) {
    var defineOpt = function (optName, defaultValue) {
        opts[optName] = optName in opts ? opts[optName] : defaultValue;
    };

    opts = opts || {};
    defineOpt('js', true);
    defineOpt('css', true);
    defineOpt('basePath', "");
    defineOpt('returnstream',false)
    defineOpt('less', true);
    defineOpt('favicon', false);
    defineOpt('src', true);
    defineOpt('skipNotExistingFiles', false);
    defineOpt('appendQueryToPath', false);

    return through.obj(function (file, enc, cb) {
        var content,
            retVal,
            that = this,
            extraсtedResources;

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError('gulp-resources', 'Streams are not supported!'));
            return cb();
        }
        if (file.isBuffer()) {
            content = file.contents.toString('utf8');
            try {
                extraсtedResources = resources(content, opts);
            } catch (ex) {
                this.emit('error', ex);
                return cb();
            }


            if(opts.returnstream === true){
                extraсtedResources.forEach(function(resource) {
                    // console.log(resource.type);
                    // console.log(opts.basePath + resource.content);
                    if(resource.type === "url") {
                        that.push(new gutil.File({
                            base: file.base,
                            cwd: file.cwd,
                            stat: file.stat,
                            path: opts.basePath + resource.content,
                            contents: fs.readFileSync(opts.basePath + resource.content)
                        }));
                    }else{
                        that.push(new gutil.File({
                            base: file.base,
                            cwd: file.cwd,
                            stat: file.stat,
                            path: "testpath.js" + (opts.appendQueryToPath ? query : ""),
                            contents: new Buffer(resource.content,'utf-8')
                        }));
                    }

                    //
                });
            }

            retVal = JSON.stringify(extraсtedResources)
        }

        opts.returnstream===false?cb(null,retVal):cb();
    });
};
