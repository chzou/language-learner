'use strict';
const fileUpload = require('express-fileupload');

exports.data = function(req, res){
    console.log(req.files);
}