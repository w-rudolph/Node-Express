const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
router.use(cookieParser());
router.use(session({
    name: 'a3sc67esasff',
    secret: 'sessionid',   
    store: new FileStore(),   
    saveUninitialized: false,  
    resave: false, 
    cookie: {
        maxAge: 24 * 60 * 1000
    }
}));
//router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(function(req, res, next){
	if(req.url.indexOf('/login') === -1 && !req.session.user){
		return res.redirect('/login?redirect_url=' + encodeURIComponent(req.url));
	}
	next();
});
router.get('/', function(req, res){
  res.render('index', {
	  users: [{name: 'jack', age:21},{name: 'tom', age: 15}],
	  title: 'index page',
	  username:req.session.user
  });
})
.get('/about', function(req, res){
  res.render('about', {
	  content: 'About page',
	  title: 'About page',
	  username:req.session.user
  });
})
.get('/contact', function(req, res){
  res.render('contact',{
	  content: 'Contact page',
	  title: 'Contact page',
	  username:req.session.user
  });
})
.get('/login', function(req, res){
  res.render('login',{
	  content: 'Login page',
	  title: 'Login page',
	  url: req.url
  });
})
.post('/login*', function(req, res){
	if(req.body.username && req.body.password){
		let matched = req.url.match(/redirect_url=(.*)/);
	    let resirect_url = matched && matched.length > 1 && matched[1] ? matched[1] : "/";
		req.session.user = req.body.username;
		res.redirect(decodeURIComponent(resirect_url));
	}else{
		res.redirect(req.url);
	}
})
.get('/logout', function(req, res){
	req.session.user = "";
	res.redirect('login');
});

//404
router.get('*', function(req, res){
  res.render('404', {
	  title: 'Page Not Found!',
	  username:req.session.user
  })
})
module.exports = router;