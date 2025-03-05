const express = require('express');

const answer = require('../../red/answers');
const userDb = require('./userService');

const router = express.Router();

router.get('/',async function (req, res){
    let allUsers = await  userDb.all();
    answer.success(req, res, allUsers, 200);
})

router.get('/:id',async function (req, res){
    let singleUser  = await  userDb.one(req.params.id);
    answer.success(req, res, singleUser, 200);

    answer.error(req, res, 'Error en el servidor', 500);
})



module.exports = router;