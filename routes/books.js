const router = require('express').Router()
const Book = require('../models/book')
const Author = require('../models/author')
// setelah menggunakan filepond path dan fs tidak dibutuhkan lagi
// const path = require('path')
// const fs = require('fs')
// const uploadPath = path.join('public',Book.coverImageBasePath) // setelah menggunakan filepond ini tidak digunakan lagi
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg']
// multer tidak diperlukan lagi kalau kita menggunakan filepond
// const imageMimeTypes = ['.jpeg', '.png', '.gif', '.jpg'] (sebelum menggunakan filepond)
// const multer = require('multer')
// const upload = multer({
//   dest: uploadPath,
//   fileFilter: (req, file, callback)=>{
//     const extension = path.extname(file.originalname).toLowerCase();
//     const isMatch = imageMimeTypes.includes(extension)
//     callback(null, isMatch)
//   }
//   // fileFilter: function (req, file, cb) {
//   //   const extension = path.extname(file.originalname).toLowerCase();
//   //   console.log(extension)
//   //   const mimetyp = file.mimetype;
//   //   const isMatch = imageMimeTypes.includes(extension)
//   //   console.log(mimetyp)
//   //   if(isMatch){
//   //     cb(null, true)
//   //   }else{
//   //     cb('error message', false)
//   //     // cb(new Error('FILE NOT SUPPORT!!!'))
//   //   }
    
//   // },
// })

 
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

// sebelum menggunakan filepond
// Create Book Route
// router.post('/', upload.single('cover') ,async (req, res)=>{
//   const fileName = req.file != null ? req.file.filename : null
//   const book = new Book({
//     title: req.body.title,
//     author: req.body.author,
//     publishDate: new Date(req.body.publishDate),
//     pageCount: req.body.pageCount,
//     coverImageName: fileName,
//     description: req.body.description
//   })
//   try {
//     const newBook = await book.save()
//     // res.redirect(`books/${newBook.id}`)
//     res.redirect(`books`)
//   } catch (error) {
//     if(book.coverImageName != null){
//       removeBookCover(book.coverImageName)
//     }
//     renderNewPage(res, book, true)
//   }
// })

// setelah menggunakan FilePond
router.post('/',async (req, res)=>{
  console.log(`ini isi dari req.body.cover ${req.body.cover}`)
  // const fileName = req.file != null ? req.file.filename : null //setelah menggunakan filepond tidak perlu lagi
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    // coverImageName: fileName, // setelah menggukanak filepon tidak perlu lagi
    description: req.body.description
  })
  saveCover(book, req.body.cover)
  try {
    const newBook = await book.save()
    res.redirect(`books/${newBook.id}`)
    // res.redirect(`books`)
  } catch (error) {
    // stelah menggunakan filepond tidak membutuhkan logic ini lagi
    // if(book.coverImageName != null){
    //   removeBookCover(book.coverImageName)
    // }
    renderNewPage(res, book, true)
  }
})

// show book routes
router.get('/:id', async (req, res)=>{
  console.log('masuk ke rooter books')
  try {
    const book = await Book.findById(req.params.id).populate('author').exec()
    res.render('books/show',{book})
  } catch (error) {
    res.redirect('/')
  }
})

// Edit Book Route
router.get('/:id/edit', async (req, res)=>{
  try {
    const book = await Book.findById(req.params.id)
    renderEditPage(res, book)
  } catch (error) {
    res.redirect('/')
  }
})

// Edit Book Route
router.put('/:id',async (req, res)=>{
  let book
  try {
    book = await Book.findById(req.params.id)
    book.title = req.body.title
    book.author = req.body.author
    book.publishDate = new Date(req.body.publishDate)
    book.pageCount = req.body.pageCount
    book.description = req.body.description
    if(req.body.cover != null && req.body.cover !== ''){
      saveCover(book. req.body.cover)
    }
    await book.save()
    res.redirect(`/books/${book.id}`)
  } catch (error) {
    // stelah menggunakan filepond tidak membutuhkan logic ini lagi
    // if(book.coverImageName != null){
    //   removeBookCover(book.coverImageName)
    // }
    console.log(error)
    if(book != null ){
      renderEditPage(res, book, true)
    }else{
      redirect('/')
    }
    
  }
})

// Delete Book Route
router.delete('/:id', async (req, res)=>{
  let book
  try {
    book = await Book.findById(req.params.id)
    await book.remove()
    res.redirect('/books')
  } catch (error) {
    if(book != null){
      res.render('books',{
        book:book, errorMessage: 'Could not remove book'
      })
    }else{
      res.redirect('/')
    }
  }
})

function saveCover(book, coverEncoded){
  if(coverEncoded == null) return
  const cover = JSON.parse(coverEncoded)
  if(cover != null && imageMimeTypes.includes(cover.type)){
    // karena tipe data dari cover image adalah buffer jadi harus di convert ke buffer karna yang di dapat string
    book.coverImage = new Buffer.from(cover.data, 'base64')
    book.coverImageType = cover.type
  }
}

// stelah menggunakan filepond tidak dibutuhkan lagi fungsi ini 
// function removeBookCover(fileName){
//   fs.unlink(path.join(uploadPath, fileName), error =>{
//     if (error) console.error(error)
//   })
// }

async function renderNewPage(res, book, hasError = false) {
  renderFormPage(res, book, 'new', hasError)
} 

async function renderEditPage(res, book, hasError = false) {
  renderFormPage(res, book, 'edit', hasError)
}

async function renderFormPage(res, book, form, hasError = false) {
  try {
    const authors = await Author.find({})
    const params = {
      authors,
      book
     }
    if(hasError){
      if(form === 'edit'){
        params.errorMessage = 'Error Editing Book'
      }else{
        params.errorMessage = 'error creating Book'
      }
    }
    res.render(`books/${form}`,params)
   } catch (error) {
     res.redirect('/books')
   }
} 

module.exports = router