const router = require('express').Router()
const Book = require('../models/book')
const Author = require('../models/author')
const path = require('path')
const fs = require('fs')
const uploadPath = path.join('public',Book.coverImageBasePath)
const imageMimeTypes = ['.jpeg', '.png', '.gif', '.jpg']
const multer = require('multer')
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback)=>{
    const extension = path.extname(file.originalname).toLowerCase();
    const isMatch = imageMimeTypes.includes(extension)
    callback(null, isMatch)
  }
  // fileFilter: function (req, file, cb) {
  //   const extension = path.extname(file.originalname).toLowerCase();
  //   console.log(extension)
  //   const mimetyp = file.mimetype;
  //   const isMatch = imageMimeTypes.includes(extension)
  //   console.log(mimetyp)
  //   if(isMatch){
  //     cb(null, true)
  //   }else{
  //     cb('error message', false)
  //     // cb(new Error('FILE NOT SUPPORT!!!'))
  //   }
    
  // },
})

 
// All Books Routes
router.get('/', async (req, res)=>{
  let query = Book.find()
  if(req.query.title != null && req.query.title != ''){
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if(req.query.publishBefore != null && req.query.publishBefore != ''){
    // lte = less then or equel to
    query = query.lte('publishDate', req.query.publishBefore)

  }
  if(req.query.publishAfter != null && req.query.publishAfter != ''){
    // gte = greather then or equel to
    query = query.gte('publishDate', req.query.publishAfter)

  }
  try {
    let books = await query.exec()
    res.render('books/index',{
      books,
      searchOptions: req.query
    })
  } catch (error) {
    res.redirect('/')
  }
})

// new Book Form Route
router.get('/new', async (req, res)=>{
  renderNewPage(res, new Book())
})

// Create Book Route
router.post('/', upload.single('cover') ,async (req, res)=>{
  const fileName = req.file != null ? req.file.filename : null
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    coverImageName: fileName,
    description: req.body.description
  })
  try {
    const newBook = await book.save()
    // res.redirect(`books/${newBook.id}`)
    res.redirect(`books`)
  } catch (error) {
    if(book.coverImageName != null){
      removeBookCover(book.coverImageName)
    }
    renderNewPage(res, book, true)
  }
})

async function removeBookCover(fileName){
  fs.unlink(path.join(uploadPath, fileName), error =>{
    if (error) console.error(error)
  })
}

async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({})
    const params = {
      authors,
      book
     }
    if(hasError) params.errorMessage = 'error creating Book'
    res.render('books/new',params)
   } catch (error) {
     res.redirect('/books')
   }
} 

module.exports = router