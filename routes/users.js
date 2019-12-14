var express = require('express');
var router = express.Router();
var userModel = require('../models/userModel');
var jwt = require('jsonwebtoken');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/getLearnerDetail', function (req, res, next) {
  if (req.user[0].id === Number.parseInt(req.body.id)) {
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

module.exports = router;
