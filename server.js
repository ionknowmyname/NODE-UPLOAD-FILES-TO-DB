const express = require('express')
const mongoose = require('mongoose')
const expressLayouts = require("express-ejs-layouts");
// const multer = require('multer')
// const uuid = require('uuid').v4
const path = require('path')

const mainRoute = require('./routes/mainRoutes')


////////////////////  MongoDB Connection ////////////////////////
mongoose.connect('mongodb://localhost:27017/ImageUploadDB', {useNewUrlParser: true, useUnifiedTopology: true}, (err) =>{
    if (!err) {
       console.log("MongoDB connection success"); 
    }else{
        console.log("Error in DB Connection: " + err);
    }
});
//////////////////////////////////////////////////////////////////


const app = express()

app.use(express.static(__dirname + '/public/'))
// app.use(express.static('./uploads'))

////// EJS  SETUP  ///////
app.use(expressLayouts);
app.set('view engine', 'ejs');
//////////////////////////


//////////// Bodyparser middleware //////////////
app.use(express.urlencoded({ extended: true }));   
/////////////////////////////////////////////////



app.use('/', mainRoute)



//////////////////// Server start //////////////////
const PORT = process.env.PORT || 5001
app.listen(PORT, ()=>{ 
    console.log(`server started on port ${PORT}`); 
});
/////////////////////////////////////////////////////