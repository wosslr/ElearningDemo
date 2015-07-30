
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.login = function(req, res){
  res.render('login', { title: 'Express' });
};

exports.loginpost = function(req, res){
	var user={
	        username: 'admin',
	        password: '123456'
	    }
	    if(req.body.username === user.username && req.body.password === user.password){
	        res.redirect('/home');
	    }
	    res.redirect('/login');
};

exports.home = function( req, res ){
	var user={
	        username:'admin',
	        password:'123456'
	    }
	res.render('home', { title: 'Home', user: user });
}

exports.logout = function(req, res){
	res.redirect('/');
}