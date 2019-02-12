
'use strict';

const fs =              require('fs');
const readline =        require('readline');
const es =              require('event-stream')
const MongoClient =     require('mongodb').MongoClient;
 
// Connection URL
const url = 'mongodb://localhost:27017';
 
// Database Name
const dbName = 'bookshop';
let db = ''
let collection = ''
 

const insertDocuments = (obj) => {
    return new Promise(async(resolve, reject) => {
        
        // Insert some documents
        const result = await collection.insertOne(obj)
        resolve(result)
    })
    
  }
  var lineNr = 0;

  var s = fs.createReadStream('txtdata/auto.txt')
      .pipe(es.split())
      .pipe(es.mapSync(function(line){
          if(lineNr > 10) return  
          // pause the readstream
          s.pause();
  
          lineNr += 1;

  
          // process line here and call s.resume() when rdy
          // function below was for logging memory usage
          console.log(line)
          console.log(lineNr)          
  
          // resume the readstream, possibly from a callback
          s.resume();
      })
      .on('error', function(err){
          console.log('Error while reading file.', err);
      })
      .on('end', function(){
          console.log('Read entire file.')
      })
  );
  /*
let x = 0
function convert(file) {

    return new Promise((resolve, reject) => {

        const stream = fs.createReadStream(file);
        // Handle stream error (IE: file not found)
        stream.on('error', reject);

        const reader = readline.createInterface({
            input: stream
        });

        const array = [];
        let x = 0
        let jsonstring = '{'
        let transform
        let item
        reader.on('line', async(line) => {            
            if (x>10) return
            let n = line.indexOf("ITEM")
            if (n==0) {                 
                item = line 
            }
            if (n !== 0) {
                let y = line.indexOf("=")
                
                if (y !== -1) {
                    // read a txt line - format for key value
                     // first remove any illegal characters especially " (inch)
                    line = line.replace(/[|&;$%@"<>()+,]/g, "");               
                    let key = `"` + line.substring(0, y) + `"`
                    let property = `"` + line.substring(y+1) + `"`
                    transform = jsonstring
                    transform = transform + key + ": " + property + ", "
                    jsonstring = transform                    
                } else {

                    // limit creation of json objects
                    //if (x>100) return
                    
                    // read a blank line - we completed string object                    
                    // strip of blank which is last character
                   
                    jsonstring = jsonstring.substring(0, jsonstring.length-1)
                    // replace comma with }
                    jsonstring = jsonstring.replace(/.$/,"}")           
                    //console.log(jsonstring)
                    x++
                    console.log(`Pushing ${item} as number ${x}`) 

                    //array.push(JSON.parse(jsonstring))   
                    let obj = JSON.parse(jsonstring)
                    console.log(obj)
                    let post = await insertDocuments(obj)
                    console.log(post)
                    jsonstring = "{"         
                    
                }
            }
           
        });

        reader.on('close', () => {
            console.log(`made it here`)
           // console.log(jsonstring)
            
            resolve(array) })
    });
}

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
    if (err) console.log('Error connecting to Mongo')
    db = client.db(dbName);
    console.log("Connected successfully to server");
    // Get the documents collection
    collection = db.collection('auto')

    convert('txtdata/auto.txt')
    .then(res => {
        console.log(res);
    })
    .catch(err => console.error(err));
   
  });
*/
