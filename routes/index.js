

// https://www.npmjs.com/package/plain-text-data-to-json

// https://github.com/nicolashery/example-stream-parser

// checkout const qs = require('querystring');
//https://nodejs.org/api/querystring.html

'use strict';

const fs =              require('fs');
const readline =        require('readline');
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

  // http://2ality.com/2018/04/async-iter-nodejs.html
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

