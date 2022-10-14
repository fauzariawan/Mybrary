const router = require('express').Router();
const authorsRoutes = require('./authors')

router.get('/', (req, res)=>{
  res.render('index')
})
router.use('/authors', authorsRoutes)

module.exports = router