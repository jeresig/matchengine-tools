var fs = require("fs");
var path = require("path");
var async = require("async");
var ArgumentParser = require("argparse").ArgumentParser;

var argparser = new ArgumentParser({
    description: "Upload a directory of images to MatchEngine."
});

argparser.addArgument(["dir"], {
    help: "The directory in which to place the images in MatchEngine " +
        "(e.g. 'camping')."
});

argparser.addArgument(["path"], {
    help: "The directory path of images to upload (e.g. /my/images/camping/)."
});

argparser.addArgument(["--conf"], {
    defaultValue: __dirname + "/me.conf.json",
    help: "The JSON config file containing MatchEngine auth details " +
        "(default: me.conf.json)."
});

argparser.addArgument(["--batch"], {
    defaultValue: 100,
    type: "int",
    help: "The number of images to upload in a single batch (up to 1000) " +
        "(default: 100)."
});

argparser.addArgument(["--pause"], {
    defaultValue: 5000,
    type: "int",
    help: "How long to pause, in milliseconds, inbetween uploads " + 
        "(default: 5000)."
});

var args = argparser.parseArgs();

var conf = require(args.conf);
var ME = require("matchengine")(conf);

console.log("Downloading file data from MatchEngine...");

ME.list(function(err, results) {
    fs.readdir(args.path, function(err, allFiles) {
        var groups = [];
        var count = 1;
        var doneFiles = {};

        console.log("Filtering out already-uploaded files...");

        results.forEach(function(file) {
            doneFiles[file] = true;
        });

        // Filter out files that've already been uploaded
        allFiles = allFiles.filter(function(file) {
            var meFile = (args.dir ? args.dir + "/" : "") +
                path.basename(file);
            return !(meFile in doneFiles);
        });

        // Map the files to their real location
        allFiles = allFiles.map(function(file) {
            return path.resolve(args.path, file);
        });

        // Group the files into batches of files to upload
        for (var i = 0; i < allFiles.length; i += args.batch) {
            groups.push(allFiles.slice(i, i + args.batch));
        }

        async.eachSeries(groups, function(files, callback) {
            console.log("Uploading batch [" +
                count + "/" + groups.length + "]");

            ME.add(files, args.dir, function(err) {
                console.log("Batch done #" + count);
                count += 1;

                // Pause at the end of the upload
                setTimeout(callback, args.pause);
            });
        }, function(err) {
            console.log("DONE");
        });
    });
});
