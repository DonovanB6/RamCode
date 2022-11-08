const express = require("express");

const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post(
  "", checkAuth,
  (req,res,next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    answer2: req.body.answer2,
    answer3: req.body.answer3,
    answer4: req.body.answer4,
    creator: req.userData.userId
  });
  post.save().then(result => {
    res.status(201).json({
      message: 'Post added successfully',
      postId: result._id
    });
  });

});

router.put("/:id", checkAuth,
(req,res,next)=>
{
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    answer2: req.body.answer2,
    answer3: req.body.answer3,
    answer4: req.body.answer4,
    creator: req.userData.userId,

  });
  console.log(req.body);
  Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post).then(result => {
    if(result.matchedCount > 0)
    {
      res.status(200).json({message: "Update successful!"});
    } else
    {
      res.status(401).json({message: "Not Authorized!"});
    }

  })
})

router.get('',(req,res,next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if(pageSize && currentPage)
  {
    postQuery
    .skip(pageSize*(currentPage - 1))
    .limit(pageSize);
  }
  postQuery.then(documents => {
    fetchedPosts = documents;
    return Post.count();
  })
  .then(count => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: fetchedPosts,
      maxPosts: count
    });
  });

});

router.get("/:id", (req,res,next) => {
  Post.findById(req.params.id).then(post => {
    if(post)
    {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Post not found!'});
    }
  })
});

router.delete("/:id", checkAuth,
(req,res,next) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result =>
    {
      if(result.deletedCount > 0)
    {
      res.status(200).json({message: "Deletion successful!"});
    } else
    {
      res.status(401).json({message: "Not Authorized!"});
    }
    })

});



module.exports = router;
