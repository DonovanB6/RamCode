const express = require("express");

const Question = require('../models/Question');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get("", checkAuth, (req,res,next) => {
  Question.count().exec(function (err, count) {


    var random = Math.floor(Math.random() * count)


    Question.findOne().skip(random).then(question => {
        if(question)
        {
        console.log(question);
        return res.status(200).json(question);
        }
        else {
          res.status(404).json({message: 'Post not found!'});
        }
      })
  })
})


module.exports = router;
