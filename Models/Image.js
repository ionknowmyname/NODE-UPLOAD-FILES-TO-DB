const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ImageSchema = new Schema(
    { 
        // designation: { type: String, required: true },
        // name: { type: String, required: true },
        // staffID: { type: String, required: true },
        // email: { type: String, required: true },
        // phone: { type: String },
        filePath: { type: String }, // required is being handled by post router
        // status: { type: String, default: 'Submitted', required: true } 
    }, { timestamps: true }
)


const Image = mongoose.model('Image', ImageSchema)
module.exports = Image