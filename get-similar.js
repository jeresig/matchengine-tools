var fs = require("fs");
var async = require("async");
var JSONStream = require("JSONStream");
var ArgumentParser = require("argparse").ArgumentParser;

var argparser = new ArgumentParser({
    description: "Downloads image similarity data from MatchEngine. " +
        "Outputs JSON results to the specified file. Results will be " +
        "written out as one large object, the keys of which will be " +
        "the IDs of the files on the MatchEngine service. The value will " +
        "be an array of objects holding the match data. Files with no " +
        "matches will not be written out."
});

argparser.addArgument(["outFile"], {
    help: "File to which the JSON output should be written."
});

argparser.addArgument(["--conf"], {
    defaultValue: __dirname + "/me.conf.json",
    help: "The JSON config file containing MatchEngine auth details " +
        "(default: me.conf.json)."
});

argparser.addArgument(["--threads"], {
    defaultValue: 2,
    type: "int",
    help: "Number of simulataneous requests to make (default: 2, max: 4)."
});

argparser.addArgument(["--filter"], {
    help: "Filter for which MatchEngine files to download the results of. " +
        "For example: 'sample' will only download matches that are prefixed " +
        "with 'sample'."
});

var args = argparser.parseArgs();

var conf = require(args.conf);
var ME = require("matchengine")(conf);

var numDownloaded = 0;
var totalImages = 0;
var fileStream;

console.log("Loading Match Engine data...");

ME.list(function(err, results) {
    fileStream = JSONStream.stringifyObject();
    fileStream.pipe(fs.createWriteStream(args.outFile));

    if (args.filter) {
        results = results.filter(function(image) {
            return image.indexOf(args.filter) === 0;
        });
    }

    totalImages = results.length;

    async.eachLimit(results, args.threads, queryImage, function(err) {
        console.log("Done Querying Match Engine.");
        fileStream.end();
    });
});

function queryImage(image, callback) {
    numDownloaded += 1;
    console.log("[" + numDownloaded + "/" + totalImages +
        "] Querying " + image + "...");

    ME.similar(image, function(err, results) {
        // Filter out results that are just matching the same image
        results = results.filter(function(item) {
            return item.filepath !== image;
        });

        // Only log results where there is at least one match
        if (results.length > 0) {
            fileStream.write([image, results]);
        }

        callback();
    });
}
