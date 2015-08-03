/**
 * Module dependencies.
 */

var express = require('express'), routes = require('./routes/index'), users = require('./routes/user'), http = require('http'), path = require('path');

var session = require('express-session');
var Settings = require('./database/settings');
var MongoStore = require('connect-mongodb');
var db = require('./database/msession');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

// session配置
app.use(session({
	cookie : {
		maxAge : 600000
	},
	secret : Settings.COOKIE_SECRET,
	store : new MongoStore({
		username : Settings.USERNAME,
		password : Settings.PASSWORD,
		url : Settings.URL,
		db : db
	})
}))
app.use(function(req, res, next) {
	res.locals.user = req.session.user;
	var err = req.session.error;
	delete req.session.error;
	res.locals.message = '';
	if (err)
		res.locals.message = '<div class="alert alert-warning">' + err
				+ '</div>';
	next();
});

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', routes.index);
app.all('/login', notAuthentication);
app.get('/users', users.list);
app.post('/login', routes.loginpost);
app.get('/login', routes.login);
app.get('/logout', authentication);
app.get('/logout', routes.logout);
app.get('/home', authentication);
app.get('/home', routes.home);

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});

function authentication(req, res, next) {
	if (!req.session.user) {
		req.session.error = '请先登录';
		return res.redirect('/login');
	}
	next();
}
function notAuthentication(req, res, next) {
	if (req.session.user) {
		req.session.error = '已登录';
		return res.redirect('/');
	}
	next();
}