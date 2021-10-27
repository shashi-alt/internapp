var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var userModule = require('../module/user');
var newpasswordmodule = require('../module/forgotpsw');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

/* GET home page. */
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}
//  image part routes

var Storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  }
});

var upload = multer({
  storage: Storage
}).single('file');


function checkLoginUser(req, res, next) {
  var userToken = localStorage.getItem('userToken');
  try {
    var decoded = jwt.verify(userToken, 'loginToken');
  } catch (err) {
    res.redirect('/');
  }
  next();
}

function checkusername(req, res, next) {
  var uname = req.body.uname;
  var checkexitusername = userModule.findOne({ username: uname });
  checkexitusername.exec((err, Data) => {
    if (err) throw err;
    if (Data) {
      return res.render('signup', { title: 'Customers Records Management', msg: 'UserName Already Exit' });
    }
    next();
  });
}

function CheckEmail(req, res, next) {
  var Email = req.body.Email;
  var checkexitemail = userModule.findOne({ Email: Email });
  checkexitemail.exec((err, Data) => {
    if (err) throw err;
    if (Data) {
      return res.render('signup', { title: 'Customers Records Management', msg: 'Email Already Exit' });
    }
    next();
  });
};

router.get('/', function (req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  if (loginUser) {
    res.redirect('./dashboard');
  } else {
    res.render('index', { title: 'Customers Records Management', msg: '' });
  }
});


router.post('/', function (req, res, next) {
  var username = req.body.uname;
  var password = req.body.password;
  var checkUser = userModule.findOne({ username: username });
  checkUser.exec((err, data) => {
    if (data == null) {
      res.render('index', { title: 'Customers Records Management', msg: 'You are Not a Registered Customer Please Register First' })
    }
    else {
      if (err) throw err;
      var getUserID = data._id;
      var getPassword = data.password;
      if (bcrypt.compareSync(password, getPassword)) {
        var token = jwt.sign({ userID: getUserID }, 'loginToken');
        localStorage.setItem('userToken', token);
        localStorage.setItem('loginUser', username);
        res.redirect('/dashboard');
      } else {
        res.render('index', { title: 'Customers Records Management', msg: 'Invalid Username and Password' })

      }
    }
  });
});


router.get('/signup', function (req, res, next) {
  res.render('signup', { title: 'Customers Records Management', msg: '' })
});

router.post('/signup', upload, checkusername, CheckEmail, function (req, res, next) {
  var username = req.body.uname;
  var Email = req.body.Email;
  var image = req.file.filename;
  var password = req.body.password;
  var confpassword = req.body.confirmpassword

  if (password != confpassword) {
    res.render('signup', { title: 'Customers Records Management', msg: 'Password Not Mached' });
  }
  else {
    password = bcrypt.hashSync(req.body.password);
    var userDetails = new userModule({
      username: username,
      Email: Email,
      image: image,
      password: password,
    });
  }

  userDetails.save((err, doc) => {
    if (err) throw err;
  });
  res.render('signup', { title: 'Customers Records Management', record: '', msg: 'Customer Resistered Successfully' });
});


router.get('/forgotpsw', function (req, res, next) {
  res.render('forgotpsw', { title: 'Customers Records Management', msg: '' })
});

router.post('/forgotpsw', function (req, res, next) {
  var password = req.body.password;
  var confpassword = req.body.confirmpassword

  if (password != confpassword) {
    res.render('forgotpsw', { title: 'Customers Records Management', msg: 'Password Not Mached' });
  }
  else {
    var newpasswordDetails = new newpasswordmodule({
      password: password,
    });
  }

  newpasswordDetails.save((err, doc) => {
    if (err) throw err;
  });
  res.render('forgotpsw', { title: 'Customers Records Management', record: '', msg: 'Your New Password Created Successfully ' });
});




router.get('/dashboard', checkLoginUser, function (req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  res.render('dashboard', { title: 'Customers Records Management', loginUser: loginUser, msg: '' })
});


router.get('/Logout', function (req, res, next) {
  localStorage.removeItem('userToken');
  localStorage.removeItem('loginUser');
  res.redirect('/');
});
module.exports = router;
