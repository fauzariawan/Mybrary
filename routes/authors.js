const router = require('express').Router();
const Author = require('../models/author')

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
    res.redirect('authors')
    // res.redirect(`authors/${newAuthor}`)
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


module.exports = router