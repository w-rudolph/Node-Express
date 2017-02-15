const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const User = require('../models/user.js');
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
	if(req.url.indexOf('/login') === -1 && req.url.indexOf('/register') === -1 && !req.session.user){
		return res.redirect('/login?redirect_url=' + encodeURIComponent(req.url));
	}
	if(req.url.indexOf('/login') !== -1 && req.session.user){
		return res.redirect('/');
	}
	next();
});
router.get('/', function(req, res){
   User.getUsers((err, rows, fields) => {
	  if(!err)
        res.render('index', {
		  users: rows,
		  title: 'index page',
		  username:req.session.user.name
       });		   
   })
})
.get('/about', function(req, res){
  res.render('about', {
	  content: 'About page',
	  title: 'About page',
	  username:req.session.user.name
  });
})
.get('/contact', function(req, res){
  res.render('contact',{
	  content: 'Contact page',
	  title: 'Contact page',
	  username:req.session.user.name
  });
})
.get('/login', function(req, res){
  res.render('login',{
	  content: 'Login page',
	  title: 'Login page',
	  url: req.url,
	  msg: ""
  });
})
.get('/register', (req, res) => {
	renderPage(res, 'register',{
	  content: 'register page',
	  title: 'Register page',
	  url: req.url,
	  msg: ""
  });
})
.post('/login*', function(req, res){
	if(req.body.username && req.body.password){
		User.authUser(req.body.username, req.body.password, (err, rows, fields) =>{
			if(!err){
				if(rows.length !== 0){
					let matched = req.url.match(/redirect_url=(.*)/);
					let resirect_url = matched && matched.length > 1 && matched[1] ? matched[1] : "/";
					req.session.user = rows[0];
					res.redirect(decodeURIComponent(resirect_url));
					req.session.msg = "";
				}else{
				    renderPage(res, 'login', {
						  content: 'login page',
						  title: 'Login page',
						  url: req.url,
						  msg: '密码或账号错误'
					 })
			    }
			}
		})
	}else{
		renderPage(res, 'login', {
			  content: 'login page',
		      title: 'Login page',
			  url: req.url,
			  msg: '密码或账号不能为空'
		 })
	}
})
.get('/logout', function(req, res){
	req.session.user = null;
	res.redirect('login');
})
.post('/register', (req, res) => {
	if(req.body.username && req.body.password){
		User.register(req.body.username, req.body.password, (err, data) =>{
			if(!err){
				req.session.user = data;
				req.session.msg = '';
				res.redirect('/');
			}else{
				if(err === 'USER_EXIST'){
		            renderPage(res, 'register', {
						  content: 'register page',
						  title: 'Register page',
						  url: req.url,
						  msg: '用户已存在'
					})
				}
			}
		})
	}else{
		renderPage(res, 'register', {
			  content: 'register page',
		      title: 'Register page',
			  url: req.url,
			  msg: '密码或账号不能为空'
		 })
	}
});

//404
router.get('*', function(req, res){
  res.render('404', {
	  title: 'Page Not Found!',
	  username:req.session.user.name
  })
})
function renderPage(res, tpl, options){
	res.render(tpl,options);
}
module.exports = router;