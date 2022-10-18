const router = require('express').Router();
const authorsRoutes = require('./authors')
const booksRoutes = require('./books')
const Book = require('../models/book')

router.get('/', async (req, res)=>{
  let books
  try {
    books = await Book.find({}).sort({createdAt: 'desc'}).limit(10).exec()
  } catch (error) {
    books = []
  }
  res.render('index', {books})
})
router.use('/authors', authorsRoutes)
router.use('/books', booksRoutes)

module.exports = router