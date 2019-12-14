var express = require('express');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var userModel = require('../models/userModel');
var majorModel = require('../models/majorModel');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json("Welcome to my world");
});

router.get('/getList', function (req, res, next) {
  var body = req.body;
  console.log(body);
  userModel.getAll(body.key, body.value)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.json({ 'error': 'lỗi rồi !!' })
    });
});


router.post('/login', (req, res, next) => {
  
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (user === false) {
      res.json({ user, info })
    }
    else {
      if (err || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user,
        });
      }

      req.login(user, { session: false }, (err) => {
        if (err) {
          res.send(err);
        }


        let payload = { id: user.loginUser.id };
        const token = jwt.sign(payload, '1612018_1612175');
        return res.json({ user, token, info });
      });
    }
  })(req, next);
});

router.post('/register-student', (req, res) => {
  var user = req.body;

  userModel.getByUsername(user.username)
    .then((data) => {
      console.log("user");
      console.log(user);
      if (data.length > 0) { // đã tồn tại
        res.json({ message: 'Username is existed', code: -1 });
      }
      else {
        userModel.register(user)
          .then(() => {
            res.json({ message: 'Register success !!!', code: 1 });
          })
          .catch((error) => {
            console.log(error);
            res.json({ message: 'Register fail !!!', code: 0 });
          });
      }
    })
    .catch((error) => {
      res.end('Có lỗi');
    });

});

router.post('/register-tutor', (req, res) => {
  var user = req.body;

  userModel.getByEmail(user.username)
    .then((data) => {
      console.log("user");
      console.log(user);
      if (data.length > 0) { // đã tồn tại
        res.json({ message: 'Username is existed', code: -1 });
      }
      else {
        userModel.register(user)
          .then((responseData) => {
            userModel.addTutor(user, responseData.id);
            res.json({ message: 'Register success !!!', code: 1 });
          })
          .catch((error) => {
            console.log(error);
            res.json({ message: 'Register fail !!!', code: 0 });
          });
      }
    })
    .catch((error) => {
      res.end('Có lỗi');
    });

});

router.get('/getMajors', (req, res) => {
  var user = req.body;

  majorModel.getAll()
    .then((data) => {
      console.log("Majors returned:");
      console.log(data);
      // const token = jwt.sign(payload, '1612018_1612175');
      res.json(data);
    })
    .catch((error) => {
      res.end('Có lỗi');
    });
})

router.get('/getTopMajors', (req, res) => {
  majorModel.getTop()
    .then((data) => {
      console.log("Majors returned:");
      console.log(data);
      res.json(data);
    })
    .catch((error) => {
      res.end('Có lỗi');
    });
})


module.exports = router;
