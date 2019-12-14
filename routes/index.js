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
  console.log(req.body);
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (user === false) {
      res.json({
        user,
        info: {
          message: info.message,
          code: 0,
        }
      })
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
        if (user.loginUser.role === Number.parseInt(req.body.role)) {
          let payload = { id: user.loginUser.id };
          const token = jwt.sign(payload, '1612018_1612175');
          return res.json({ user, token, info });

        }
        else {// Không cùng role
          return res.json({
            user: false,
            info: {
              message: 'Role is not corrected',
              code: 2,
            }
          })
        }
      });
    }
  })(req, next);
});

router.post('/login-facebook', (req, res) => {
  let user = req.body;

  userModel.getByFacebookId(user.id_social)
    .then((data) => {
      if (data.length > 0) { // đã tồn tại
        let fbUser = data[0]
        if (fbUser.role === req.body.role) {
          let payload = { id: fbUser.id };
          const token = jwt.sign(payload, '1612018_1612175');
          return res.json({
            user: fbUser,
            token,
            info: {
              message: 'Logged in successfully',
              code: 3
            }
          });
        }
        else {// Không cùng role
          return res.json({
            user: false,
            info: {
              message: 'Role is not corrected',
              code: 2,
            }
          })
        }
      }
      else { // Chưa tồn tại
        // Tạo và thêm acc mới vào
        userModel.addFacebookUser({
          name: user.name,
          id_social: user.id_social,
          email: user.email,
          avatarLink: user.avatarLink,
        }, user.role)
          .then(() => {
            // Tạo thành công
            // Tìm và trả về user tương ứng
            userModel.getByFacebookId(user.id_social)
              .then(data => {
                let fbUser = data[0];
                let payload = { id: fbUser.id };
                console.log(fbUser.avatarLink);
                const token = jwt.sign(payload, '1612018_1612175');
                return res.json({
                  user: fbUser,
                  token,
                  info: {
                    message: 'Logged in successfully',
                    code: 3
                  }
                });
              })
              .catch(error => {
                return res.json({
                  user: false,
                  info: {
                    message: 'Logged in fail 2',
                    code: 0
                  }
                });
              });
          });


      }


    })
    .catch((error) => { // Lỗi
      return res.json({
        user: false,
        info: {
          message: 'Logged in fail 1',
          code: 0
        }
      });
    });
  /*
  let payload = { id: user.loginUser.id };
  const token = jwt.sign(payload, '1612018_1612175');
  return res.json({ user, token, info });
  */
})


router.post('/login-google', (req, res) => {
  let user = req.body;

  userModel.getByGoogleId(user.id_social)
    .then((data) => {
      if (data.length > 0) { // đã tồn tại
        let ggUser = data[0]
        if (ggUser.role === req.body.role) {
          let payload = { id: ggUser.id };
          const token = jwt.sign(payload, '1612018_1612175');
          return res.json({
            user: ggUser,
            token,
            info: {
              message: 'Logged in successfully',
              code: 3
            }
          });
        }
        else {// Không cùng role
          return res.json({
            user: false,
            info: {
              message: 'Role is not corrected',
              code: 2,
            }
          })
        }
      }
      else { // Chưa tồn tại
        // Tạo và thêm acc mới vào
        userModel.addGoogleUser({
          name: user.name,
          id_social: user.id_social,
          email: user.email,
          avatarLink: user.avatarLink,
        }, user.role)
          .then(() => {
            // Tạo thành công
            // Tìm và trả về user tương ứng
            console.log(user);
            userModel.getByGoogleId(user.id_social)
              .then(data => {
                console.log(data);
                let ggUser = data[0];
                let payload = { id: ggUser.id };
                console.log(ggUser.avatarLink);
                const token = jwt.sign(payload, '1612018_1612175');
                return res.json({
                  user: ggUser,
                  token,
                  info: {
                    message: 'Logged in successfully',
                    code: 3
                  }
                });
              })
              .catch(error => {
                console.log(error);
                return res.json({
                  user: false,
                  info: {
                    message: 'Logged in fail 2',
                    code: 0
                  }
                });
              });
          });


      }

    })
    .catch((error) => { // Lỗi
      return res.json({
        user: false,
        info: {
          message: 'Logged in fail 1',
          code: 0
        }
      });
    });
  /*
  let payload = { id: user.loginUser.id };
  const token = jwt.sign(payload, '1612018_1612175');
  return res.json({ user, token, info });
  */
})


router.post('/register-student', (req, res) => {
  var user = req.body;
  console.log(user);
  userModel.getByEmail(user.email)
    .then((data) => {

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
  userModel.getByEmail(user.email)
    .then((data) => {
      if (data.length > 0) { // đã tồn tại
        res.json({ message: 'Email is existed', code: -1 });
      }
      else {
        userModel.register(user)
          .then((responseData) => {
            console.log("This is response data");
            console.log(responseData);
            userModel.addTutor(user, responseData.insertId)
              .then(data => {
                res.json({ message: 'Register success !!!', code: 1 });
              })
              .catch((error) => {
                console.log(error);
                res.json({ message: 'Register fail !!!', code: 0, err: error });
              });
          })
          .catch((error) => {
            console.log(error);
            res.json({ message: 'Register fail !!!', code: 0, err: error });
          });
      }
    })
    .catch((error) => {
      console.log(error);
      res.end('Có lỗi');
    });

});

router.get('/getMajors', (req, res) => {
  majorModel.getAll()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.end('Có lỗi');
    });
})

router.get('/getTopMajors', (req, res) => {
  majorModel.getTop()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.end('Có lỗi');
    });
})


module.exports = router;
