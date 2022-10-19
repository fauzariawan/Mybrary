const mongoose = require('mongoose')
const path = require('path')
// const coverImageBasePath = 'uploads/bookCovers' // setelah menggunakan filepond ini tidak dibutuhkan lagi
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  publishDate: {
    type: Date,
    required: true
  },
  pageCount: {
    type: Number ,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date()
  },
  // sebelum menggunakan filepond
  // coverImageName: {
  //   type: String,
  //   required: true
  // },

  // setelah menggunakan filepond 
  coverImage: {
    type: Buffer,
    required: true
  },
  coverImageType:{
    type: String,
    required: true
  },
  // ini batas perubahan setelah menggunakan filepond yang bawah udah ga berubah
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Author' // harus sama dengan nama model author nya  
  }
})

// sebelum menggunakan filepond
// bookSchema.virtual('coverImagePath').get(function(){
//   if(this.coverImageName != null){
//     return path.join('/', coverImageBasePath, this.coverImageName)
//   }
// })

// setelah menggunakan FilePond
bookSchema.virtual('coverImagePath').get(function(){
  if(this.coverImage != null && this.coverImageType != null){
    return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`;
  }
})

module.exports = mongoose.model('Book', bookSchema)
// module.exports.coverImageBasePath = coverImageBasePath // setelah menggunakan filepond ini tidak dibutuhkan lagi