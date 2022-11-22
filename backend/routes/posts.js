const express = require("express");

const checkAuth = require('../middleware/check-auth');
const Question = require("../models/Question");

const router = express.Router();

router.post(
  "", checkAuth,
  (req,res,next) => {
  const question = new Question({
    title: req.body.title,
    correct: req.body.correct,
    answer2: req.body.answer2,
    answer3: req.body.answer3,
    answer4: req.body.answer4,
    creator: req.userData.userId
  });
  question.save().then(result => {
    res.status(201).json({
      message: 'Post added successfully',
      questionId: result._id
    });
  });

});

router.put("/:id", checkAuth,
(req,res,next)=>
{
  const question = new Question({
    _id: req.body.id,
    title: req.body.title,
    correct: req.body.correct,
    answer2: req.body.answer2,
    answer3: req.body.answer3,
    answer4: req.body.answer4,
    creator: req.userData.userId,

  });
  console.log(req.body);
  Question.updateOne({_id: req.params.id, creator: req.userData.userId}, question).then(result => {
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
  const questionQuery = Question.find();
  let fetchedQ;
  if(pageSize && currentPage)
  {
    questionQuery
    .skip(pageSize*(currentPage - 1))
    .limit(pageSize);
  }
  questionQuery.then(documents => {
    fetchedQ = documents;
    return Question.count();
  })
  .then(count => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      questions: fetchedQ,
      maxQuestions: count
    });
  });

});

router.get("/:id", (req,res,next) => {
  Question.findById(req.params.id).then(question => {
    if(question)
    {
      res.status(200).json(question);
    } else {
      res.status(404).json({message: 'Post not found!'});
    }
  })
});



router.delete("/:id", checkAuth,
(req,res,next) => {
  Question.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result =>
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
