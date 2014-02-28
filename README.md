matchengine-tools
=================

Tools for interacting with TinEye's MatchEngine.

## get-similar.js

```
usage: get-similar.js [-h] [--conf CONF] [--threads THREADS] [--filter FILTER]
                      outFile

Downloads image similarity data from MatchEngine. Outputs JSON results to the
specified file. Results will be written out as one large object, the keys of
which will be the IDs of the files on the MatchEngine service. The value will
be an array of objects holding the match data. Files with no matches will not
be written out.

Positional arguments:
  outFile            File to which the JSON output should be written.

Optional arguments:
  -h, --help         Show this help message and exit.
  --conf CONF        The JSON config file containing MatchEngine auth details
                     (default: me.conf.json).
  --threads THREADS  Number of simulataneous requests to make (default: 2,
                     max: 4).
  --filter FILTER    Filter for which MatchEngine files to download the
                     results of. For example: 'sample' will only download
                     matches that are prefixed with 'sample'.
```

## bulk-upload.js

```
usage: bulk-upload.js [-h] [--conf CONF] [--batch BATCH] [--pause PAUSE]
                      dir path

Upload a directory of images to MatchEngine.

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
                 1000) (default: 1000).
  --pause PAUSE  How long to pause, in milliseconds, inbetween uploads
                 (default: 0).
```
