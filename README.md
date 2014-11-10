MatchEngine Tools
=================

Tools for interacting with [TinEye's MatchEngine](https://services.tineye.com/MatchEngine) service. These tools were created to support bulk generation of the image similarity data that MatchEngine produces. This is far from the most common use case for the service but is one which works well for the analysis of art. (If you're looking for a more generic MatchEngine library, I can recommend [the following](https://www.npmjs.org/package/matchengine), which these tools use.) More information about the project in which this was used, and this paticular implementation can be found in the following [paper](http://ejohn.org/research/computer-vision-photo-archives/).

In short, following the details laid out in the [implementation overview](http://ejohn.org/research/computer-vision-photo-archives/#implementation), the data is generated through two steps.

* First: by uploading all the images that you wish to analyze to the MatchEngine service, in bulk. The `bulk-upload.js` script provides this capability.
* Second: by downloading all the image similarity data from MatchEngine and storing it in a local JSON file. This is what `get-similar.js` provides.

## Installation

These tools use [Node.js](http://nodejs.org/) and it must be installed in order for them to run correctly. You'll want to get a copy of this repository and place it somewhere locally. In this directory you'll want to run the following command, to install all the dependencies required to run this script:

    npm install

After that has completed you'll need to copy the `sample-me.conf.json` file and create a new file called `me.conf.json`. You'll then want to edit this new file and put your MatchEngine username and password inside of it.

    {
        "username": "YOUR MATCHENGINE USERNAME",
        "password": "YOUR MATCHENGINE PASSWORD",
        "server": "matchengine.tineye.com"
    }

(You'll receive these details after you sign up for a MatchEngine account.)

## bulk-upload.js

Uploads a directory of images to MatchEngine. Given a directory of JPEG images this script will upload them all to MatchEngine, in batches, until completion. The images must be given a directory with which to prefix the images.

For example, if you had a directory on your computer with a number of JPEG images in it:

    /images/1.jpg
    /images/2.jpg
    /images/3.jpg
    etc.

You would need to pick a directory prefix for the images, for example 'camping'. Then to upload the images you would run:

    node bulk-upload.js camping /images/

This would incrementally upload all the images in the `/images/` directory and give them a name of `camping/1.jpg`, `camping/2.jpg`, etc. on MatchEngine.

Additional command line options for the tool are as follows:

```
usage: bulk-upload.js [-h] [--conf CONF] [--batch BATCH] [--pause PAUSE]
                      dir path

Positional arguments:
  dir            The directory in which to place the images in MatchEngine (e.
                 g. 'camping').
  path           The directory path of images to upload (e.g.
                 /my/images/camping/).

Optional arguments:
  -h, --help     Show this help message and exit.
  --conf CONF    The JSON config file containing MatchEngine auth details
                 (default: me.conf.json).
  --batch BATCH  The number of images to upload in a single batch (up to
                 1000) (default: 100).
  --pause PAUSE  How long to pause, in milliseconds, inbetween uploads
                 (default: 5000).
```

## get-similar.js

Downloads image similarity data from MatchEngine. Outputs JSON results to the
specified file.

JSON results will be written out as one large object, the keys of
which will be the IDs of the files on the MatchEngine service. The value will
be an array of objects holding the match data. A sample of the JSON results can be seen here:

    ...
    "frick-anon-italian/13291.jpg": [
        {
            "score": "27.80",
            "target_overlap_percent": "100.00",
            "overlay": "...",
            "query_overlap_percent": "47.18",
            "filepath": "frick-anon-italian/13291b.jpg"
        },
        {
            "score": "12.50",
            "target_overlap_percent": "100.00",
            "overlay": "...",
            "query_overlap_percent": "20.93",
            "filepath": "frick-anon-italian/13291a.jpg"
        }
    ],
    ...

Files with no matches will not be written out. Unless you wish to download the image similarity data for every single image you've ever uploaded to MatchEngine you'll likely want to specify a filter to the script.

A full example of running the script looks something like this:

    node get-similar.js --filter camping similarity.json

Additional command line options for the tool are as follows:

```
usage: get-similar.js [-h] [--conf CONF] [--threads THREADS] [--filter FILTER]
                      outFile

Positional arguments:
  outFile            File to which the JSON output should be written.

Optional arguments:
  -h, --help         Show this help message and exit.
  --conf CONF        The JSON config file containing MatchEngine auth details
                     (default: me.conf.json).
  --threads THREADS  Number of simulataneous requests to make (default: 2,
                     max: 4).
  --filter FILTER    Filter for which MatchEngine files to download the
                     results of. For example: 'camping' will only download
                     matches that are prefixed with 'camping'.
  --reject REJECT    Reject certain matches from being downloaded.
```

Credits
===

Created by [John Resig](http://ejohn.org/). Released under an MIT license.

Funding for this project was sponsored by a [Digital Resources](http://www.kressfoundation.org/grants/default.aspx?id=150) grant from the [Kress Foundation](http://www.kressfoundation.org/).