var express = require('express');
var router = express.Router();
var userModel = require('../models/userModel');
var contractModel = require('../models/contractModel');

var jwt = require('jsonwebtoken');
var passport = require('passport');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/getLearnerDetail', function (req, res, next) {
  var curUser = JSON.stringify(req.user);
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

router.put('/editPersonalInfo', function (req, res, next) {
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
        console.log(body.name);
        userModel.updateBasicInfo(body.id, body)
          .then(data => {
            console.log(body.name);
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

router.put('/editProfessionalInfo', function (req, res, next) {
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
  contractModel.CreateContract(body.id, body)
    .then(data => {
      const payload = { id: body.id };
      let token = jwt.sign(payload, '1612018_1612175');
      res.json({
        code: 1,
        info: {
          data,
          token,
          message: "Create successfully",
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

module.exports = router;
