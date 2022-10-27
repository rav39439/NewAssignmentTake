var express=require("express")
var app=express()
const path=require('path')
const http=require('http').createServer(app)
var router = express.Router();

require('dotenv').config()
const connection = require('./db')

var bodyParser=require("body-parser")
// app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
// app.use(bodyParser.json({limit: '50mb'}))

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.set("view engine", "ejs")

app.get('/seats', (req, res) => {

   
    connection.query("select * from `TABLE 8` ", function (err, data, fields) {
        if (err) { throw (err) }
        data = JSON.stringify(data)
        
       res.send(data)
       
})
})

function middleware(req,res,next){
   
    let count=0
    let nulldata=[]
    connection.query("select * from `TABLE 8`", function (err, data, fields) {
        if (err) { throw (err) }

    for(i=0;i<data.length;i++){
        if(data[i].is_booked=='booked'){
            count++
        }
        else{
nulldata.push(data[i])
        }
    }

    let percentage=(count/data.length*100)
    //console.log(percentage)
        req.data=percentage
        req.emptyseats=nulldata
        //console.log(req.emptyseats)
        next()
       
})

}


app.get('/seats/:id', middleware,(req, res) => {

   
    connection.query("select * from `TABLE 9`", function (err, data, fields) {
        if (err) { throw (err) }
        console.log("the size is")
        console.log(req.data.length)
        
var seatinfo={}




        for(i=0;i<req.emptyseats.length;i++){
if(req.emptyseats[i].id==req.params.id){
 // console.log(req.emptyseats[i].id)
    for(j=0;j<data.length;j++){
        if(data[j].seat_class==req.emptyseats[i].seat_class){
            seatinfo.seat_class=req.emptyseats[i].seat_class
            seatinfo.is_booked=req.emptyseats[i].is_booked
            seatinfo.seat_identifier=req.emptyseats[i].seat_identifier
            price=data[j].min_price
            
            if(data[j].min_price!="" && req.data<=40){
                seatinfo.price=data[j].min_price
               break
            }
            if(data[j].normal_price!="" && req.data<=40){
                seatinfo.price=data[j].normal_price
              break
            } 



            if(data[j].normal_price!="" && req.data>40 && req.data<=60){
                seatinfo.price=data[j].normal_price
              break
            } 
            if(data[j].max_price!="" && req.data>40 && req.data<=60){
                seatinfo.price=data[j].max_price
              break
            } 


            if(data[j].max_price!="" && req.data>60){
                seatinfo.price=data[j].max_price
                break
              
            }  if(data[j].normal_price!="" && req.data>60){
                seatinfo.price=data[j].normal_price
              break
            } 

           else{
            seatinfo.price="no ticket"
           }
        }
    }

}
        }


    
        data = JSON.stringify(seatinfo)
        

        
       res.send(data)
       
})
})

app.post("/booking",function(req,res){

    console.log(req.body)

    var mydata = "UPDATE `TABLE 8` SET username='" + req.body.username + "', phoneno='"+req.body.phoneno+"',is_booked='booked' WHERE id='"+req.body.id+"'";

    connection.query(mydata, function (err, result) {
        if (err) {throw err}
        else{
            res.send("ticket booked")
        }

        
    })
})
app.get("/booking/:phoneno",function(req,res){

    console.log(req.body)

    var mydata = "select * from `TABLE 8` where phoneno='"+req.params.phoneno+"'";

    connection.query(mydata, function (err, result) {
        if (err) {throw err}
        else{
            data = JSON.stringify(result)
            res.send(data)
        }

        
    })
})




app.get("/media",function(req,res){


    res.render('login.ejs')
})


app.post("/login",function(req,res){
    if(req.body.username=="rav9876iy"&&req.body.password=="rav87906"){
        res.redirect("/newmedia")
    }
})

app.get("/newmedia",function(req,res){
    res.render("mynewmedia")
})


app.post("/new",function(req,res){
    console.log(req.body)
})

const PORT=process.env.PORT

http.listen(PORT||8800, () => {
    console.log("listening")
})