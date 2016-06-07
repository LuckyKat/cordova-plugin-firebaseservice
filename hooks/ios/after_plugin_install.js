#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

module.exports = function(context) {
	// Get the GoogleService-Info.plist from the www folder and move it to the android project folder
	var src = path.join(context.opts.projectRoot, 'www', 'GoogleService-Info.plist');
	if (fs.existsSync(src)) {
		var data = fs.readFileSync(src);

		// Get the project name from the config.xml
		var contents = fs.readFileSync(path.join(context.opts.projectRoot, "config.xml"), 'utf-8');
	    if(contents) {
	        //Windows is the BOM. Skip the Byte Order Mark.
	        contents = contents.substring(contents.indexOf('<'));
	    }
	    var et = context.requireCordovaModule('elementtree');
	    var projectName = et.XML(contents).findtext('name');

	    // Overwrite the mock GoogleService-Info.plist
		var dst = path.join(context.opts.projectRoot, 'platforms', 'ios', projectName, 'Resources', 'GoogleService-Info.plist');
		fs.writeFileSync(dst, data);
		fs.unlinkSync(src);
	}
}