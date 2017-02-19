var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var index = require('./routes/index');
var users = require('./routes/users');
var submit = require('./routes/imagesubmit');
var player = require('play-sound')(opts = {});
var fs = require('fs');
var recordAudio = require("record-audio");
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
var jsonparser = bodyParser({ limit: '50mb' });
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

app.use('/', index);
app.use('/users', users);
app.post('/submitimage', urlencodedParser, function(req, res) {
    var image = req.body.foo.replace(/^data:image\/jpeg;base64,/, "");
    var filePath = __dirname + "/imagefile.jpeg";
    fs.writeFile(filePath, image, "base64", function(err) {
        if (err) {} else {} // does nothing -- error suppression
    });
    var i = 1;
    var opts = { verbose: true };

    visionClient.detectLabels(filePath, opts, function(err, labels, apiResponse) {
        console.log(apiResponse);
        if (err) {
            console.log(err.name);
            console.log(JSON.stringify(err.errors, null, 2));
            res.send({ done: "NOT DONE" });
        } else {
            for (var label of labels) {
                console.log(label);
                if (label.score > 60) {
                    var spawn = require('child_process').spawn,
                        py = spawn('python', ['question.py', label.desc]);
                    var fname = '';

                    py.stdout.on('data', function(data) {
                        console.log("I MADE IT!");
                        fname += data;
                    });
                    py.stdout.on('end', function() {
                        fname = fname.toString().replace(/(\r\n|\n|\r)/gm, "");
                        fs.readFile(__dirname + '/' + fname, function(err, datum) {
                            console.log(fname);
                            if (err) console.log(err);
                            else res.send({ data: datum.toString("base64") });
                        });
                    });
                    break;
                }
            }
        }

    });

});

var speech_to_text = new SpeechToTextV1({
    username: '9ac80cd3-4dca-4044-95ff-b858d1846656',
    password: 'Mo8rpn3lPAb6'
});

app.post('/submitaudio', urlencodedParser, function(req, res) {
    var sound = req.body.foo.replace(/^data:audio\/wav;base64,/, "");
    var filePath = __dirname + "/audiofile.wav";
    fs.writeFile(filePath, sound, "base64", function(err) {
        if (err) {} else {} // does nothing -- error suppression
    });

    var params = {
        model: 'en-US_NarrowbandModel',
        audio: fs.createReadStream(filePath),
        content_type: 'audio/wav',
        timestamps: true,
        word_alternatives_threshold: 0.9,
        continuous: true
    };

    speech_to_text.recognize(params, function(error, transcript) {
        if (error) {
            console.log(error.name);
            console.log(JSON.stringify(error.errors, null, 2));
            res.send({ done: "NOT DONE" });
        } else {
            var outputStr = "";
            for (var i = 0; i < transcript.results.length; i++) {
                var result = transcript.results[i].alternatives;
                for (var j = 0; j < result.length; j++) {
                    var output = result[j].transcript;
                    outputStr += output;
                }
            }
            console.log(outputStr);

            var spawn = require('child_process').spawn,
                py = spawn('python', ['conversation.py', outputStr]);
            var fname = '';

            py.stdout.on('data', function(data) {
                console.log("I MADE IT!");
                fname += data;
                
            });
            py.stdout.on('end', function() {
                console.log(fname);
                fname = fname.toString().replace(/(\r\n|\n|\r)/gm, "");
                fs.readFile(__dirname + '/' + fname, function(err, datum) {
                    if (datum) {
                        console.log(fname);
                        if (err) console.log(err);
                        else res.send({ data: datum.toString("base64") });
                    } else {
                      console.log("nothing");
                    }
                });
            });
        }
    });

    //res.send("AUDIO DONE");
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
