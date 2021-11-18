const express = require('express');
const multer = require('multer'),
 bodyParser = require('body-parser'),
 path = require('path');
const mongoose = require('mongoose');
const Detail = require('./models/detail');
const fs = require('fs');
const maxSize = 4 * 1024 * 1024; // for 4MB

const dir = './uploads';
mongoose.connect('mongodb+srv://harsh:harsh@cluster0.ssoip.mongodb.net/uploadFiles');

const upload = multer({
  storage: multer.diskStorage({

    destination: (req, file, callback) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      callback(null, './uploads');
    },
    filename: (req, file, callback) => { callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); }

  }),

  fileFilter: (req, file, callback) => {
    const ext = path.extname(file.originalname)
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(null, false)
    }
    callback(null, true)
  },
  limits: { fileSize: maxSize }
});

const app = new express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('uploads'));

app.get('/', (req, res) => {
  Detail.find({}, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.render('index', { data: data });
    }
  })

});

app.post('/', upload.any(), (req, res) => {

  if (!req.body && !req.files) {
    res.json({ success: false });
  } else {
    
    Detail.findOne({}, (err, data) => {

      const detail = new Detail({

        Name: req.body.title,
        image1: req.files[0] && req.files[0].filename ? req.files[0].filename : '',
      });

      detail.save((err, Person) => {
        if (err)
          console.log(err);
        else
          res.redirect('/');

      });

    });

  }
});

app.post('/delete', (req, res) => {

  Detail.findByIdAndRemove(req.body.prodId, (err, data) => {

    fs.unlinkSync(`./uploads/${data.image1}`);

  })
  res.redirect('/');
});

const port = process.env.PORT || 3000
app.listen(port, () => { console.log('listening on port ' + port); });