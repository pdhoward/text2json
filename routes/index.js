
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
  function convert(file) {

    return new Promise((resolve, reject) => {
            let x = 0
            let jsonstring = '{'
            let transform
            let item
            var s = fs.createReadStream('txtdata/auto.txt')
                .pipe(es.split())
                .pipe(es.mapSync( async function(line){
                    //if(lineNr > 25) return  
                    // pause the readstream
                    s.pause();
            
                    lineNr += 1;
            
                    let n = line.indexOf("ITEM")
                    if (n==0) {                 
                        item = line 

                        s.resume();
                    }

                    if (n !== 0) {
                        let y = line.indexOf("=")
                        
                        if (y !== -1) {
                            // TRrnsform this line to key and value
                            // first remove any illegal characters especially " (inch)
                            line = line.replace(/[|&;$%@"<>()+,]/g, "");               
                            let key = `"` + line.substring(0, y) + `"`
                            let value = `"` + line.substring(y+1) + `"`
                            transform = jsonstring
                            transform = transform + key + ": " + value + ", "
                            jsonstring = transform  
                            
                            s.resume();

                        } else {        
                            // limit creation of json objects
                            //if (x>100) return
                            
                            // read a blank line - we completed string object                    
                            // strip off blank which is last character                           
                            jsonstring = jsonstring.substring(0, jsonstring.length-1)

                            // replace comma with }
                            jsonstring = jsonstring.replace(/.$/,"}")

                            //console.log(jsonstring)
                            x++
                            console.log(`Pushing ${item} as number ${x}`)
                            
                            try {
                                let obj = JSON.parse(jsonstring)
                                //console.log(obj)
                                let post = await insertDocuments(obj)
                                //console.log(post)                                
                            } catch(error) {
                                jsonstring = "{"
                                s.resume();
                            } 
                        }
                    }
                    //s.resume();
                })
                .on('error', function(err){
                    console.log('Error while reading file.', err);
                })
                .on('end', function(){
                    console.log('Read entire file.')
                    resolve({msg: 'Completed conversion of file'})
                })
            );
    })
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

