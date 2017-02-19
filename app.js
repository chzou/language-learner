var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var index = require('./routes/index');
var users = require('./routes/users');
var submit = require('./routes/imagesubmit');
var fs = require('fs');

var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false })
// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
var jsonparser = bodyParser.json();
var nouns = ["bottle", "play", "phone", "laptop"];
app.use(jsonparser);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const Vision = require('@google-cloud/vision');
const projectId = 'language-learner';

const visionClient = Vision({
    projectId: projectId
});

var ourObjects = ["cup", "drink", "apple", "glass", "person"];

app.use('/', index);
app.use('/users', users);
app.post('/submitimage',urlencodedParser, function(req, res){
    //var image = req.body.foo;
    var image = req.body.foo.replace(/^data:image\/jpeg;base64,/, "");
    var filePath = __dirname + "/imagefile.jpeg";
    fs.writeFile(filePath, image, "base64", function(err) {
        if (err) {
            // do nothing -- here to suppress warnings
        } else {

        }
    });
    var i = 1;
    var opts = {verbose: true};
    visionClient.detectLabels(filePath, opts, function(err, labels, apiResponse) {
    	console.log(apiResponse);
        if (err) {
        	i+=1;
            console.log("Error");
             console.log(i);
            res.send({done: "NOT DONE"});   
        } else {
        	i+=1;
        	console.log("Success");
        	
            for(var label of labels){
            	console.log(label);
            	if(ourObjects.indexOf(label.desc) >= 0){
            		if(label.score > 70){
            			 console.log(i);
            			res.send({done: "DONE"});
            			break;
            		}
            	}

            };
             console.log(i);
            res.send({done: "NOT DONE"})
        }

    });
	/*var rand = Math.random() * (100)
	console.log(rand);
	if(rand > 80){
		res.send({data: "DONE"});
	}else{
		res.send({data: "NOT DONE"});
	}*/

   
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
