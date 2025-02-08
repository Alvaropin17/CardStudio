const express = require('express');

const answer = require('../../red/answers');
const userDb = require('./userDbControler');

const router = express.Router();

router.get('/', function (req, res){
    let allUsers = userDb.all();
    answer.success(req, res, allUsers, 200);
})

module.exports = router;