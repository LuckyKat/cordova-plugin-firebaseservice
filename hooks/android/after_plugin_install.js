#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

// Check of gradle file that we are going to append to the main build.gradle
var DATA = `
// Added by plugin cordova-plugin-firebaseservice
apply plugin: 'com.google.gms.google-services'
buildscript {
    repositories {
        jcenter()
    }

    dependencies {
        classpath 'com.google.gms:google-services:3.0.0'
    }
}
`;
var DATA_APP = `
dependencies {
    compile 'com.google.android.gms:play-services-ads:9.0.0'
    compile 'com.google.android.gms:play-services-analytics:9.0.0'
    compile 'com.google.firebase:firebase-core:9.0.0'
    compile 'com.google.firebase:firebase-crash:9.0.0'
}
apply plugin: 'com.google.gms.google-services'
`;

module.exports = function(context) {
	// Modify the build.gradle to add support for the gms plugin
	fs.appendFileSync(path.join(context.opts.projectRoot, 'platforms', 'android', 'build.gradle'), DATA);
	// Modify the app's build.gradle
	fs.appendFileSync(path.join(context.opts.plugin.dir, 'platforms', 'android', 'build.gradle'), DATA_APP);

	// Get the google-services.json from the uncompressed zip file and move it to the andorid project folder
	var src = path.join(context.opts.projectRoot, 'www', 'google-services.json');
	if (fs.existsSync(src)) {
		var data = fs.readFileSync(src);
		var dst = path.join(context.opts.projectRoot, 'platforms', 'android', 'google-services.json');
		fs.writeFileSync(dst, data);
		fs.unlinkSync(src);
	}
}
