

exports.index = function(req, res) {
	authentication_index(req, res);
	res.render('index', {
		title : 'Express'
	});
};

exports.login = function(req, res) {
	authentication_index(req, res);
	res.render('login', {
		title : 'Express'
	});
};

exports.loginpost = function(req, res) {
	var user = {
		username : 'admin',
		password : '123456'
	}
	if (req.body.username === user.username
			&& req.body.password === user.password) {
		try {
			req.session.user=user;
			res.redirect('/home');
		} catch (err) {
			console.log(err);
			res.redirect('/home');
		}
	} else {
		req.session.error='用户名或密码不正确';
		res.redirect('/login');
	}
};

exports.home = function(req, res) {
	authentication(req, res);
	var user = req.user;
	res.render('home', {
		title : 'Home',
		user : user
	});
}

exports.logout = function(req, res) {
	req.session.user = null;
	req.logout();
	res.redirect('/');
}

function authentication(req, res) {
	if (!req.session.passport.user) {
		return res.redirect('/login');
	}
}

function authentication_index(req, res) {
	if (req.session.passport.user) {
		return res.redirect('/home');
	}
}