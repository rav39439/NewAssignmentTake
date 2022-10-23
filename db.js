const mysql=require('mysql');
const express=require('express');
const bodyparser = require('body-parser');
const { DATABASE } = process.env;
const { PASSWORD } = process.env;
const { KEYHOST } = process.env;
const { KEYUSER } = process.env;
const { KEYPORT } = process.env;

const app=express();

var connection=mysql.createConnection({
    host:KEYHOST,
    user:KEYUSER,
    password:PASSWORD,
    database:DATABASE,
    port:KEYPORT

})
connection.connect((err)=>{
    if(err){
        console.log(err)
    }
    else{
        console.log('connected')
    }
})

// connection.query('select * from tabletest1', (err,results,fields)=>{
//     if(err){
//         return console.log(err)

//     }
//     return console.log(results)
// })

connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
          console.log("server is not working")                    // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });


module.exports=connection