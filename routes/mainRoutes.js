const express = require("express")
const router = express.Router()
const multer = require('multer')
const uuid = require('uuid').v4
const Image = require('../Models/Image')
const path = require('path')


/// to keep format of file type intact during uploads & Uploads ///
const storage = multer.diskStorage({
     // destination: './uploads'      // this also works
    destination: (req, file, cb) => {  // cb = callback
        cb(null, 'uploads/images/')   // uploads folder
    },
    filename: (req, file, cb) => { 
        const ext = path.extname(file.originalname)
        const id = uuid()
        const filePath = `${id}${ext}`  // /images/${id}${ext}
        Image.create({ filePath: filePath })
        .then(() => {
            cb(null, filePath) 
        })    
    }
})

const upload = multer({ 
    storage: storage,
    limits: {fileSize: 1000000},  // bytes, so 1MB 
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);   // makes sure only images are uploaded
    }  
}).single('pic');


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

router.get('/complaints', (req, res) => { res.render('images') })    // rendering ejs of complaints



router.post('/complaints/new', /*upload.single('pic'), */ (req, res) => {  // where pic is name from file input type in html form
   
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
                    file: `uploads/images/${req.file.filename}`
                })
                // res.redirect('/complaints')
            }
        }
    })
})

router.post('/complaints', (req, res) => { 
    // handles searching on db
    res.render('images', { list: docs }); 
})



module.exports = router