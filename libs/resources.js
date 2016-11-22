var cheerio = require('cheerio'),
    fs = require('fs'),
    path = require('path'),
    gutil = require('gulp-util'),
    _ = require('lodash'),
    glob = require('glob');


var expandResources = function (resource,type) {
    type = type || "url";
    var retVal = {
        type: type,
        content : resource
    };
    return retVal;
};

var escapeContent = function(content) {
    var entityMap = {
        '"': '&quot;',
        "'": '&#39;'
       
    };


    return String(content).replace(/["']/g, function (s) {
        return entityMap[s];
    });

}

module.exports = function (content,opts) {
    var $ = cheerio.load(content), resources = [];

    $('script,link').each(function (i, element) {
        var $element = $(element);

        if (opts.js && $element.is('script') && $element.attr('src')) {
            resources.push(expandResources($element.attr('src'),"url"));
        }
        if (opts.js && $element.is('script') && !$element.attr('src')) {
            resources.push(expandResources(escapeContent($element.html()),'script'));
        }

    });

    return resources;
};
