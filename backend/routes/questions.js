const express = require("express");

const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get("", checkAuth, (req,res,next) => {
  Post.count().exec(function (err, count) {

    // Get a random entry
    var random = Math.floor(Math.random() * count)

    // Again query all users but only fetch one offset by our random #
    Post.findOne().skip(random).then(post => {
        if(post)
        {
        console.log(post);
        return res.status(200).json(post);
        }
        else {
          res.status(404).json({message: 'Post not found!'});
        }
      })
  })
})


module.exports = router;
