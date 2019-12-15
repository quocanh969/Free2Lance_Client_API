var express = require('express');
var router = express.Router();
var userModel = require('../models/userModel');
var jwt = require('jsonwebtoken');
var passport = require('passport')

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

router.put('/editPersonalInfo', function (req, res, next) {
  var curUser = JSON.stringify(req.user);
  console.log(req.body.id);
  console.log(JSON.parse(curUser).id);
  var body = req.body;
  if (JSON.parse(curUser).id === Number.parseInt(req.body.id)) {
    userModel.updateBasicInfo(body.id, body)
      .then(data => {
        const payload = { id: body.id };
        let token = jwt.sign(payload, '1612018_1612175');
        res.json({ data, token, message: "edit successful" });
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
        res.json({ data, token, message: "edit successful" });
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
