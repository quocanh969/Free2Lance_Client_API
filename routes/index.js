var express = require('express');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var nodemailer = require('nodemailer');
var crypto = require('crypto');

var userModel = require('../models/userModel');
var majorModel = require('../models/majorModel');
var areaModel = require('../models/areaModel');
var skillModel = require('../models/skillModel');
var contractModel = require('../models/contractModel');


var router = express.Router();
var _ = require('lodash')

const EMAIL_USERNAME = "ubertutor018175";
const EMAIL_PASSWORD = "Ubertutor123";

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
          err,
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
  userModel.getByEmail(user.email, null)
    .then((data) => {

      if (data.length > 0) { // đã tồn tại
        res.json({ message: 'Username is existed', code: -1 });
      }
      else {
        userModel.register(user)
          .then((data) => {
            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: `${EMAIL_USERNAME}`,
                pass: `${EMAIL_PASSWORD}`,
              },
            });
            const mailOptions = {
              from: EMAIL_USERNAME,
              to: `${user.email}`,
              subject: 'Link To Activate Your Account',
              text:
                'You are receiving this because you (or someone else) have signed up to our website.\n\n'
                + 'Please click on the following link, or paste this into your browser to complete the process:\n\n'

                + `http://localhost:3000/activate-account/id=${data.insertId}\n\n`

                + 'If you did not request this, please ignore this email and your account will not be activate.\n',
            };
            transporter.sendMail(mailOptions, (err, response) => {
              if (err) {
                res.json({ message: 'Register fail while sending an email !!!', code: 0 });
              } else {
                res.json({ message: 'Register success and activate mail was sent to your email address !!!', code: 1 });
              }
            });

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
  userModel.getByEmail(user.email, null)
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
                const transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                    user: `${EMAIL_USERNAME}`,
                    pass: `${EMAIL_PASSWORD}`,
                  },
                });
                const mailOptions = {
                  from: EMAIL_USERNAME,
                  to: `${user.email}`,
                  subject: 'Link To Activate Your Account',
                  text:
                    'You are receiving this because you (or someone else) have signed up to our website.\n\n'
                    + 'Please click on the following link, or paste this into your browser to complete the process:\n\n'

                    + `http://localhost:3000/activate-account/id=${responseData.insertId}\n\n`

                    + 'If you did not request this, please ignore this email and your account will not be activate.\n',
                };
                transporter.sendMail(mailOptions, (err, response) => {
                  if (err) {
                    res.json({ message: 'Register fail while sending an email !!!', code: 0 });
                  } else {
                    res.json({ message: 'Register success and activate mail was sent to your email address !!!', code: 1 });
                  }
                });
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
      res.json(err);
    });
})

router.get('/getTopMajors', (req, res) => {
  majorModel.getTop()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
      res.json(error);
    });
})

router.get('/getAreas', (req, res) => {
  areaModel.getAll()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      console.log(err);
      res.end(err);
    })
})


router.get('/getSkills', (req, res) => {
  skillModel.getSkills()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      console.log(err);
      res.end(err);
    })
})


router.post('/recoverPassword', (req, res) => {
  var emailStr = req.body.email;
  if (emailStr === '') {
    res.status(400).send('email require');
  }
  console.log(emailStr);
  userModel.getByEmail(emailStr, true)
    .then(user => {
      console.log(user.length);
      if (user.length === 0) {
        res.json({
          code: 0,
          info: {
            data: null,
            token: null,
            message: 'User not found in db!',
          }
        })
      } else {
        const token = crypto.randomBytes(4).toString('hex');
        console.log("Token: " + token);
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: `${EMAIL_USERNAME}`,
            pass: `${EMAIL_PASSWORD}`,
          },
        });
        var url = `http://localhost:3000/recover-password/token=${token}&id=${user[0].id}`;
        const mailOptions = {
          from: EMAIL_USERNAME,
          to: `${user[0].email}`,
          subject: 'Link To Reset Password',
          text:
            'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
            + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n'

            + `http://localhost:3000/recover-password/token=${token}&id=${user[0].id}\n\n`,
        };
        transporter.sendMail(mailOptions, (err, response) => {
          if (err) {
            console.error('there was an error: ', err);
          } else {
            console.log('here is the res: ', response);
            res.json({
              code: 1,
              info: {
                data: null,
                token: null,
                message: 'Recovery mail sent',
              }
            });
          }
        });
      }
    })
    .catch(err => {
      res.json({
        code: 0,
        info: {
          data: null,
          token: null,
          message: err,
        }
      })
    })
})

router.put('/getNewPassword', (req, res) => {
  var id = Number.parseInt(req.body.id);
  userModel.recoverPassword(id, req.body.newPassword)
    .then(data => {
      res.json({
        code: 1,
        info: {
          data: req.body.newPassword,
          token: null,
          message: 'New password updated',
        }
      })
    })
    .catch(err => {
      res.json({
        code: 0,
        info: {
          data: null,
          token: null,
          message: err,
        }
      })
    })
})

router.put('/activated', (req, res) => {
  var id = Number.parseInt(req.body.id);
  userModel.activateAcc(id)
    .then(data => {
      res.json({
        code: 1,
        info: {
          data,
          token: null,
          message: 'Account activated',
        }
      })
    })
    .catch(err => {
      res.json({
        code: 0,
        info: {
          data: null,
          token: null,
          message: err,
        }
      })
    })
})

router.get('/getTopTutor', (req, res) => {
  userModel.getTopTutor()
    .then(data => {
      const tutors = _.groupBy(data, "id");
      console.log(JSON.parse(JSON.stringify(tutors)));
      var final = [];
      _.forEach(tutors, (value, key) => {
        const skills = _.map(value, item => {
          const { skill, id_skill, skill_tag } = item;
          return { skill, id_skill, skill_tag };
        })
        const temp = {
          id: value[0].id,
          name: value[0].name,
          email: value[0].email,
          yob: value[0].yob,
          gender: value[0].gender,
          id_area: value[0].id_area,
          area: value[0].area,
          phone: value[0].phone,
          price: value[0].price,
          avatarLink: value[0].avatarLink,
          id_major: value[0].id_major,
          major_name: value[0].major_name,
          skills,
        }
        final.push(temp);
      })
      console.log(final);
      res.json({
        code: 1,
        info: {
          data: final,
          token: null,
          message: 1,
        }
      })
    })
    .catch(err => {
      res.json({
        code: 0,
        info: {
          message: err,
          token: null,
          data: null
        }
      });
    })
})

router.post('/getTutorList', (req, res) => {
  let { area, price, major, name, page } = req.body;
  price = Number.parseInt(req.body.price);
  userModel.getTutorList(area, price, major, name, page)
    .then(data => {
      const tutors = _.groupBy(data, "id");
      var final = [];
      _.forEach(tutors, (value, key) => {
        const skills = _.map(value, item => {
          const { skill, id_skill, skill_tag } = item;
          return { skill, id_skill, skill_tag };
        })
        const temp = {
          id: value[0].id,
          name: value[0].name,
          email: value[0].email,
          yob: value[0].yob,
          gender: value[0].gender,
          id_area: value[0].id_area,
          area: value[0].area,
          phone: value[0].phone,
          price: value[0].price,
          evaluation: value[0].evaluation,
          avatarLink: value[0].avatarLink,
          id_major: value[0].id_major,
          major_name: value[0].major_name,
          skills,
        }
        final.push(temp);
      })
      let total = final.length;
      final = final.slice(5 * page, 5 * page + 5);
      res.json({
        code: 1,
        info: {
          total,
          data: final,
          token: null,
          message: 1,
        }
      })
    })
    .catch(err => {
      res.json({
        code: 0,
        info: {
          message: err,
          token: null,
          data: null
        }
      });
    })
})

router.post('/getContractDetail', (req, res) => {
  let { id } = req.body;
  id = Number.parseInt(id);
  contractModel.getContractDetail(id)
    .then(data => {
      res.json({
        code: 1,
        info: {
          data,
          token: null,
          message: "Get successfully",
        }
      })
    })
    .catch(err => {
      res.json({
        code: 0,
        info: {
          data: null,
          token: null,
          message: err,
        }
      })
    })
})

router.post('/getContracts', (req, res) => {
  let { id, key, page } = req.body;
  id = Number.parseInt(id);
  key = Number.parseInt(key);
  page = Number.parseInt(page);
  contractModel.getContracts(id, key)
    .then(data => {
      let count = data.length;
      data = data.slice(page * 4, page * 4 + 4);
      res.json({
        code: 1,
        info: {
          total: count,
          data,
          token: null,
          message: "Get successfully",
        }
      })
    })
    .catch(err => {
      res.json({
        code: 0,
        info: {
          data: null,
          token: null,
          message: err,
        }
      })
    })
})

router.post('/getActiveContracts', (req, res) => {
  let { id, key, page } = req.body;
  id = Number.parseInt(id);
  key = Number.parseInt(key);
  page = Number.parseInt(page);
  contractModel.getActiveContracts(id, key)
    .then(data => {
      let count = data.length;
      data = data.slice(page * 4, page * 4 + 4);
      res.json({
        code: 1,
        info: {
          total: count,
          data,
          token: null,
          message: "Get successfully",
        }
      })
    })
    .catch(err => {
      res.json({
        code: 0,
        info: {
          data: null,
          token: null,
          message: err,
        }
      })
    })
})

router.post('/getTutorDetail', function (req, res, next) {

  userModel.getTutorDetail(req.body.id)
    .then(data => {
      userModel.getTutorSkills(req.body.id)
        .then(skills => {
          // var userData = data[0];
          const payload = { id: req.body.id };
          let token = jwt.sign(payload, '1612018_1612175');
          console.log(data);

          res.json({
            code: 1,
            info: {
              data: data[0],
              skills,
              token,
              message: "Get details successfully"
            }
          });
        })
        .catch(err => {
          console.log(err);
          res.json({
            code: 0,
            info: {
              data: null,
              token: null,
              message: err,
            }
          })
        })
    }).catch(err => {
      console.log(err);
      res.json({
        code: 0,
        info: {
          data: null,
          token: null,
          message: err,
        }
      })
    })

});

router.post('/reject', (req, res) => {
  let { id_contract } = req.body;
  id_contract = Number.parseInt(id_contract);
  contractModel.getContractDetail(id_contract)
    .then(details => {
      let learnerEmail = details[0].learner_email;
      console.log(learnerEmail);
      contractModel.rejectContract(id_contract)
        .then(data => {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: `${EMAIL_USERNAME}`,
              pass: `${EMAIL_PASSWORD}`,
            },
          });

          const mailOptions = {
            from: `${EMAIL_USERNAME}`,
            to: `${learnerEmail}`,
            subject: 'Contract rejected',
            text:
              `The tutor you required has rejected to your proposal.\n\n`
              + `Try finding another one! \n\n`
              + `Thank you for using our service`,
          };

          transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
              res.json({ message: 'Notification sent failed', code: 0 });
            } else {
              res.json({
                code: 1,
                info: {
                  message: 'Contract ' + id_contract + ' rejected by tutor id: ' + details[0].tutor_email,
                }
              })
            }
          })
        })
        .catch(err => {
          res.json({
            code: 0,
            info: {
              data: err,
              message: 'Failed to reject!',
            }
          })
        })
    })
    .catch(err => {
      res.json({
        code: 0,
        info: {
          data: err,
          message: 'Failed to reject!',
        }
      })
    })
})

router.post('/agree', (req, res) => {

  let { id_contract } = req.body;
  id_contract = Number.parseInt(id_contract);
  contractModel.getContractDetail(id_contract)
    .then(details => {
      let learnerEmail = details[0].learner_email;
      // console.log(learnerEmail);
      contractModel.agreeToContract(id_contract)
        .then(data => {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: `${EMAIL_USERNAME}`,
              pass: `${EMAIL_PASSWORD}`,
            },
          });

          const mailOptions = {
            from: `${EMAIL_USERNAME}`,
            to: `${learnerEmail}`,
            subject: 'Contract agreed',
            text:
              `The tutor you required has agreed to your proposal.\n\n`
              + `Your contract start from today! \n\n`
              + `Thank you for using our service`,
          };

          transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
              res.json({ message: 'Notification sent failed', code: 0 });
            } else {
              res.json({
                code: 1,
                info: {
                  message: 'Contract ' + id_contract + ' accepted by tutor id: ' + details[0].tutor_email,
                }
              })
            }
          })
        })
        .catch(err => {
          res.json({
            code: 0,
            info: {
              data: err,
              message: 'Failed to accept!',
            }
          })
        })
    })
    .catch(err => {
      res.json({
        code: 0,
        info: {
          data: err,
          message: 'Failed to accept!',
        }
      })
    })
})

router.put('/dueContracts', (req, res) => {
  contractModel.dueContracts().then(data => {
    contractModel.updatePriceForExpiredContracts().then(data2 => {
      res.json({
        code: 1,
        info: {
          data2,
          message: "Updated dued contracts"
        }
      })
    }).catch(err => {
      res.json({
        code: 0,
        info: {
          err,
          message: "Failed"
        }
      })
    })
  }).catch(err => {
    res.json({
      code: 0,
      info: {
        err,
        message: "Failed",
      }
    })
  })
})

module.exports = router;

