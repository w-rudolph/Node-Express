const express = require('express');
const router = express.Router();
router.get('/', function(req, res){
  res.render('index', {
	  users: [{name: 'jack', age:21},{name: 'tom', age: 15}],
	  title: 'index page'
  });
})
.get('/about', function(req, res){
  res.render('about', {
	  content: 'About page',
	  title: 'About page'
  });
})
.get('/contact', function(req, res){
  res.render('contact',{
	  content: 'Contact page',
	  title: 'Contact page'
  });
});

//404
router.get('*', function(req, res){
  res.render('404', {
	  title: 'Page Not Found!'
  })
})
module.exports = router;