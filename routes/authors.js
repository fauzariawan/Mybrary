const router = require('express').Router();
const Author = require('../models/author')
const Book = require('../models/book')

// All Authors Routes
router.get('/', async (req, res)=>{
  let searchOptions = {}
  if(req.query.name != null && req.query.name !== ''){
    // new RegExp(req.query.name, 'i') ini artinya agar tidak case sensitive
    searchOptions.name = new RegExp(req.query.name, 'i')
  }
  try {
    const authors = await Author.find(searchOptions)
    res.render('authors',{
      authors,
      searchOptions: req.query
    })
  } catch (error) {
    res.redirect('/')
  }
})

// new Author Form Route
router.get('/new',(req, res)=>{
  res.render('authors/new',{author: new Author() })
})

// Create Author Route
router.post('/', async (req, res)=>{
  const author = new Author({
    name: req.body.name
  })
  try {
    const newAuthor = await author.save()
    // res.redirect('authors')
    res.redirect(`authors/${newAuthor.id}`)
  } catch (error) {
    res.render('authors/new',{
      author: author,
      errorMessage: 'Error Creating Author'
    })
  }

  // without async await 
  // author.save((err, newAuthor)=>{
  //   if(err){
  //     res.render('authors/new',{
  //       author: author,
  //       errorMessage: 'Error Creating Author'
  //     })
  //   }else{
  //     // res.redirect(`authors/${newAuthor}`)
  //     res.redirect(`authors`)
  //   }
  // })
})

router.get('/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    const books = await Book.find({author: author.id}).limit(6).exec()
    res.render('authors/show',{author, booksByAuthor: books})
  } catch (error) {
    res.redirect('/')
  }
})

router.get('/:id/edit', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id)
    res.render('authors/edit',{author})
  } catch (error) {
    res.redirect('/authors')
  }
})

router.put('/:id', async (req, res) => {
  let author
  try {
    author = await Author.findById(req.params.id)
    author.name = req.body.name
    await author.save()
    const newAuthor = await author.save()
    res.redirect(`/authors/${author.id}`)
    // res.redirect(`authors/${newAuthor}`)
  } catch (error) {
    if(author == null){
      res.redirect('/')
    }else{
      res.render('authors/edit',{
        author: author,
        errorMessage: 'Error Updating Author'
      })
    }
    
  }
})

router.delete('/:id', async (req, res) => {
  let author
  try {
    author = await Author.findById(req.params.id)
    await author.remove()
    res.redirect('/authors')
    // res.redirect(`authors/${newAuthor}`)
  } catch (error) {
    if(author == null){
      res.redirect('/')
    }else{
      res.redirect(`/authors/${author.id}`)
    }
    
  }
})

// agar router.put, router.delete dll bisa kebaca makan harus install dependencies nya npm install method-override

module.exports = router