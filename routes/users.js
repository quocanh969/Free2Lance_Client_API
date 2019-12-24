var express = require('express');
var router = express.Router();
var userModel = require('../models/userModel');
var contractModel = require('../models/contractModel');

var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var passport = require('passport');
const EMAIL_USERNAME = "ubertutor018175";
const EMAIL_PASSWORD = "Ubertutor123";

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/getLearnerDetail', function (req, res, next) {
  var curUser = JSON.stringify(req.user);
  console.log(curUser);
  console.log(req.body.id);
  if (JSON.parse(curUser).id === Number.parseInt(req.body.id)) {
    userModel.getLearnerDetail(req.body.id)
      .then(data => {
        const payload = { id: req.body.id };
        let token = jwt.sign(payload, '1612018_1612175');
        res.json({
          code: 1,
          info: {
            data,
            token,
            message: "Get successfully"
          }
        });
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
  }
  else {
    res.json("Don't try to poke your head into other's privacy pls :(");
  }
});

router.post('/editPersonalInfo', function (req, res, next) {
  var curUser = JSON.stringify(req.user);
  console.log(req.body.id);
  console.log(JSON.parse(curUser).id);
  var body = req.body;
  if (JSON.parse(curUser).id === Number.parseInt(req.body.id)) {
    userModel.getLearnerDetail(body.id)
      .then(responseData => {
        if (body.name === null || body.name === undefined || body.name === '') body.name = responseData[0].name;
        if (body.avatarLink === null || body.avatarLink === undefined || body.avatarLink === '') body.avatarLink = responseData[0].avatarLink;
        if (body.address === null || body.address === undefined || body.address === '') body.address = responseData[0].address;
        if (body.yob === null || body.yob === undefined || body.yob === '') body.yob = responseData[0].yob;
        if (body.gender === null || body.gender === undefined || body.gender === '') body.gender = responseData[0].gender;
        
        userModel.updateBasicInfo(body.id, body)
          .then(data => {
            const payload = { id: body.id };
            let token = jwt.sign(payload, '1612018_1612175');
            res.json({
              code: 1,
              info: {
                data,
                token,
                message: "edit successful",
              }
            });
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
  }
  else {
    res.json({
      code: 0,
      info: {
        data: null,
        token: null,
        message: "Don't try to poke your head into other's privacy pls :(",
      }
    })
  }
})

router.post('/editProfessionalInfo', function (req, res, next) {
  var curUser = JSON.stringify(req.user);
  console.log(req.body.id);
  console.log(JSON.parse(curUser).id);
  var body = req.body;
  if (JSON.parse(curUser).id === Number.parseInt(req.body.id)) {
    userModel.updateProfessionalInfo(body.id, body)
      .then(data => {
        const payload = { id: body.id };
        let token = jwt.sign(payload, '1612018_1612175');
        res.json({
          code: 1,
          info: {
            data,
            token,
            message: "edit successful",
          }
        });
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
  }
  else {
    res.json({
      code: 0,
      info: {
        data: null,
        token: null,
        message: "Don't try to poke your head into other's privacy pls :(",
      }
    })
  }
})

router.put('/changePassword', function (req, res, next) {
  var curUser = JSON.stringify(req.user);
  var body = req.body;
  if (JSON.parse(curUser).id === Number.parseInt(req.body.id)) {
    userModel.getLearnerDetail(body.id)
      .then(responseData => {
        console.log("Old password " + responseData[0].password);
        var oldPassword = responseData[0].password;
        if (body.newPassword !== null && body.newPassword !== undefined && body.newPassword !== '') {
          if (body.oldPassword !== oldPassword) {
            res.json({
              code: 0,
              info: {
                data: null,
                token: null,
                message: "Old password does not match",
              }
            })
          }
          else if (body.newPassword !== body.reconfirmPassword) {
            res.json({
              code: 0,
              info: {
                data: null,
                token: null,
                message: "Reconfirmed password does not match",
              }
            })
          } else {
            userModel.updatePassword(body.id, body)
              .then(data => {
                console.log(body.name);
                const payload = { id: body.id };
                let token = jwt.sign(payload, '1612018_1612175');
                res.json({
                  code: 1,
                  info: {
                    data,
                    token,
                    message: "Change password successful",
                  }
                });
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
          }
        } else {
          res.json({
            code: 0,
            info: {
              data: null,
              token: null,
              message: "No new password input!",
            }
          })
        }
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
  }
  else {
    res.json({
      code: 0,
      info: {
        data: null,
        token: null,
        message: "Don't try to poke your head into other's privacy pls :(",
      }
    })
  }
})

router.post('/newContract', (req, res) => {
  var body = req.body;
  userModel.getTutorCurrentPrice(body.id_tutor)
    .then(price => {
      let curPrice = JSON.parse(JSON.stringify(price[0])).price;
      console.log(curPrice);
      contractModel.CreateContract(body.id, body, curPrice)
        .then(data => {
          res.json({
            code: 1,
            info: {
              data,
              message: "Created",
            }
          })
        })
        .catch(err => {
          res.json({
            code: 0,
            info: {
              data: null,
              message: err,
            }
          })
        })
    })
    .catch(err => {
      res.json({
        code: 0,
        info: {
          data: null,
          message: err,
        }
      })
    })
})

router.post('/editSkill', (req, res) => {
  var skill = req.body.id_skill;
  var type = Number.parseInt(req.body.type);
  var id = req.body.id;
  userModel.editSkill(id, skill, type)
    .then(data => {
      res.json({
        code: 1,
        info: {
          data,
          message: (type === 1 ? "Added" : "Removed") + " successfully",
        }
      })
    })
    .catch(err => {
      if (err.code === "ER_DUP_ENTRY")
        res.json({
          code: 0,
          info: {
            data: null,
            message: "Skill already added",
          }
        })
      else
        res.json({
          code: 0,
          info: {
            data: null,
            message: (type === 1 ? "Added" : "Removed") + " failed",
          }
        })
    })
})

router.post('/contractNotice', (req, res) => {
  var id_contract = req.body.id_contract;
  var email = req.body.email;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: `${EMAIL_USERNAME}`,
      pass: `${EMAIL_PASSWORD}`,
    },
  });
  var contractDetail = `http://localhost:3000/contract-details/id=${id_contract}`;
  var agreeUrl = `http://localhost:3000/replyContract/id=${id_contract}&reply=${1}`;
  var disagreeUrl = `http://localhost:3000/replyContract/id=${id_contract}&reply=${0}`;

  const mailOptions = {
    from: EMAIL_USERNAME,
    to: `${email}`,
    subject: 'Contract proposal',
    html: `<p>A learner would like to hire you as his/ her tutor.</p>
    <p>Click on the following link to view the contract:</p>
    <a href='${contractDetail}'>${contractDetail}</a><br/>
    <p>Do you agree to receive this job</p><br/>
    <button style="background-color:green;padding:10px;width:150px;border:none;cursor:pointer"><a href='${agreeUrl}' style="color:white;font-size:25px;text-decoration:none">Yes</a></button>
    <button style="background-color:red;padding:10px;width:150px;border:none;cursor:pointer"><a href='${disagreeUrl}' style="color:white;font-size:25px;text-decoration:none">No</a></button>`,
  };
  transporter.sendMail(mailOptions, (err, response) => {
    if (err) {
      res.json({ message: 'Notification sent failed', code: 0 });
    } else {
      res.json({ message: 'Notification sent', code: 1 });
    }
  });
})

router.post('/endContract', (req, res) => {
  let { id_contract, rating, complain, feedback } = req.body;
  contractModel.getContractDetail(id_contract)
    .then(details => {
      contractModel.endContract(id_contract, rating, complain, feedback)
        .then(response => {
          contractModel.getRating(details[0].id_tutor)
            .then(avg => {
              avg = Number.parseFloat(avg[0].avg);
              userModel.calculateEvaluation(details[0].id_tutor, avg)
                .then(data => {
                  res.json({
                    code: 1,
                    info: {
                      data,
                      message: "Contract ended, evaluation updated",
                    }
                  })
                })
                .catch(err => {
                  res.json({
                    code: 0,
                    info: {
                      message: "Failed1 ",
                      err,
                    }
                  })
                })
            })
            .catch(err => {
              res.json({
                code: 0,
                info: {
                  message: "Failed2 ",
                  err,
                }
              })
            })
        })
        .catch(err => {
          res.json({
            code: 0,
            info: {
              message: "Failed3 ",
              err,
            }
          })
        })
    })
    .catch(err => {
      res.json({
        code: 0,
        info: {
          message: "Failed4 ",
          err,
        }
      })
    })
})

module.exports = router;
