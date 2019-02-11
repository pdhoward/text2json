## Convert Large Text Files to JSON

// https://itnext.io/using-node-js-to-read-really-really-large-files-pt-1-d2057fe76b33

1. Update the index route with logic needed to parse the text file. Sample data sets from Amazon are included in txtdata

2. Execute program

3. Note that nodejs can handle up to 1.5 gb of data in memory. This application loads an array. Limits may be encountered requiring writing objects to mongo or using a streaming data approach as outline in the above article