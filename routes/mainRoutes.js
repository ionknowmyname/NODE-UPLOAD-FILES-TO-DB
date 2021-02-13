const express = require("express")
const router = express.Router()
const multer = require('multer')
const uuid = require('uuid').v4
const Image = require('../Models/Image')
const path = require('path')


/// to keep format of file type intact during uploads & Uploads ///
const storage = multer.diskStorage({
    /*
    destination: (req, file, cb) => {  // cb = callback
        cb(null, './public/uploads/')   // uploads folder
    },
    */

    destination: './public/uploads/',      // this also works
    
    filename: (req, file, cb) => { 
        const ext = path.extname(file.originalname)
        const id = uuid()
        const filePath = `${id}${ext}`  // /images/${id}${ext}
        cb(null, filePath)
          
        // add to DB
        Image.create({ filePath: filePath })  // filepath from DB/Image model: filepath defined above
        // .then(() => {
        //     cb(null, filePath) 
        // })    
    }
})

const upload = multer({ 
    storage: storage,
    limits: {fileSize: 1000000},  // bytes, so 1MB 
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);   // makes sure only images are uploaded
    }  
}).single('pic');  // pic from the name on form


function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png|gif/;   // allowed extensions
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())  //check extensions
    const mimetype = filetypes.test(file.mimetype)  //check mimetype incase they rename extensions

    if (mimetype && extname){  // if both true
        return cb(null, true)   // null error
    }else{
        cb('Error: Images only!'); // this will fill the error arrow function in upload function in router.post
    }
}
///////////////////////////////////////////////////////////////


router.get('/complaints/new', (req, res) => { res.render('registerComplaints') })    // ejs

// rendering ejs of complaints
router.get('/complaints', (req, res) => { 

    Image.find((err, docs) => {
        if(!err){
            //console.log(docs);
            res.render('images', { list: docs });   
        }else{
            console.log("Error in retrieving Images from DB: " + err);
        }
    });
})    



router.post('/complaints/new', /* upload.single('pic'), */ (req, res) => {  // where pic is name from file input type in html form
   
    // status = submitted


    upload(req, res, (err) => {
        if(err){ 
            res.render('registerComplaints', { msg: err}) 
        }else{
            console.log(req.file)
            if(req.file == undefined){  // no file uploaded
                res.render('registerComplaints', { msg: 'Error: No file selected!'})
            }else{
                res.render('registerComplaints', { 
                    msg: 'File Uploaded!',
                    file: `/uploads/${req.file.filename}`
                   // file: `${req.file.destination}${req.file.filename}`  // (/) already added in destination
                })
                // res.redirect('/complaints')
            }
        }
    })
})

router.post('/complaints', (req, res) => { 
    // handles searching on db
    Image.find((err, docs) => {
        if(!err){
            //console.log(docs);
            res.render('images', { list: docs });   
        }else{
            console.log("Error in retrieving Images from DB: " + err);
        }
    });

    
})



module.exports = router