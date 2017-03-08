var cheerio = require('cheerio'),
    fs = require('fs'),
    path = require('path'),
    gutil = require('gulp-util'),
    _ = require('lodash'),
    glob = require('glob');


var expandResources = function (resource,type,mode) {
    type = type || "url";
    mode = mode || "js";
    var retVal = {
        mode : mode,
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
            resources.push(expandResources(opts.returnstream === false ?escapeContent($element.html()):$element.html(),'script'));
        }
        if (opts.css && $element.is('link') && $element.attr('href')) {
            resources.push(expandResources($element.attr('href'),"url",'css'));
        }
        if (opts.js && $element.is('link') && !$element.attr('href')) {
            resources.push(expandResources(opts.returnstream === false ?escapeContent($element.html()):$element.html(),'script','css'));
        }

    });

    return resources;
};
