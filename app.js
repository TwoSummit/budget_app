/**
 * Module dependencies.
 */

const expressHandlebars = require('express-handlebars');
const helpers = require('handlebars-helpers');

//change your template engine and hostname here ('ejs' or 'dust')
var template_engine = 'hbs',
    domain = 'localhost';

var express = require('express'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    engine = require('ejs-locals'),
    routes = require('./routes'),
    http = require('http'),
    errorhandler = require('errorhandler'),
    path = require('path');

var app = express();

if (template_engine == 'dust') {
    var dust = require('dustjs-linkedin'),
        cons = require('consolidate');

    app.engine('dust', cons.dust);

} else if (template_engine == 'ejs') {
    app.engine('ejs', engine);
} else if (template_engine == 'swig') {
    var swig = require('swig'),
        cons = require('consolidate');

    app.engine('swig', cons.swig);
    //app.set('view engine', 'html');
} else if (template_engine == 'hbs') {
    var handlebarHelpers = helpers.comparison();
    var hbs = expressHandlebars.create(); // Express Handlebars init
    app.engine('hbs', hbs.engine);
}

if (template_engine == 'swig') {
    app.set('view engine', 'swig');
    app.set('view options', {
        layout: false
    });
}

app.set('template_engine', template_engine);
app.set('domain', domain);
app.set('port', process.env.PORT || 8888);
app.set('views', __dirname + '//views');
app.set('view engine', template_engine);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: 'whatever', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));
app.use(require('less-middleware')(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

//middleware
app.use(function(req, res, next) {
    if (req.session.user) {
        req.session.logged_in = true;
    }
    res.locals.session = req.session;
    res.locals.q = req.body;
    res.locals.err = false;
    next();
});

var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
    app.use(errorhandler());
}

app.locals.inspect = require('util').inspect;
app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});
