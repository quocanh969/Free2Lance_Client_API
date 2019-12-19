var express = require('express');
var router = express.Router();
var userModel = require('../models/userModel');
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
        res.json({ data, token });
      }).catch(err => {
        console.log(err);
        res.json(err);
      })
  }
  else {
    res.json("Don't try to poke your head into other's privacy pls :(");
  }
});

router.get('/getTutorDetail', function (req, res, next) {
  var curUser = JSON.stringify(req.user);
  if (JSON.parse(curUser).id === Number.parseInt(req.body.id)) {
    userModel.getTutorDetail(req.body.id)
      .then(data => {
        userModel.getTutorSkills(req.body.id)
          .then(skills => {
            // var userData = data[0];
            const payload = { id: req.body.id };
            let token = jwt.sign(payload, '1612018_1612175');
            res.json({ data: data[0], skills , token });
          })
          .catch(err => {
            console.log(err);
            res.json(err);
          })
      }).catch(err => {
        console.log(err);
        res.json(err);
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
            res.json({ responseData, data, token, message: "edit successful", isEditting: false, });
          })
          .catch(err => {
            res.json(err);
          })
      }).catch(err => {
        console.log(err);
        res.json(err);
      })
  }
  else {
    res.json(`Don't meddle with others' privacy`);
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
        res.json({ data, token, message: "edit successful", isEditting: false, });
      }).catch(err => {
        console.log(err);
        res.json(err);
      })
  }
  else {
    res.json(`Don't meddle with others' privacy`);
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
          if (body.oldPassword !== oldPassword || body.newPassword !== body.reconfirmPassword) {
            res.json({ message: "Old password does not match/ reconfirmed password does not match" });
          } else {
            userModel.updatePassword(body.id, body)
              .then(data => {
                console.log(body.name);
                const payload = { id: body.id };
                let token = jwt.sign(payload, '1612018_1612175');
                res.json({ responseData, data, token, message: "Change password successful", isEditting: false, });
              })
              .catch(err => {
                res.json(err);
              })
          }
        } else {
          res.json({ isEditting: false, message: "No new password input!" });
        }
      }).catch(err => {
        console.log(err);
        res.json(err);
      })
  }
  else {
    res.json(`Don't meddle with others' privacy`);
  }
})

module.exports = router;
