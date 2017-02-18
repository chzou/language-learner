'use strict';
const fileUpload = require('express-fileupload');

exports.data = function(req, res){
    console.log(req);
   req.files["file[0]"].mv('./images/'+"asdf"+'.jpg', function(err) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.send(name);
        }
    });
   res.end();
}