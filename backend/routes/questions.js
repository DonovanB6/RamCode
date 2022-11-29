const express = require("express");

const Question = require('../models/Question');
const checkAuth = require('../middleware/check-auth');
const User = require('../models/user');
const AnsweredQuestions = require('../models/AnsweredQuestions');
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

router.put("", checkAuth, (req,res,next) => {
  console.log('Here', req.body);
  /*User.findByIdAndUpdate(
    req.body.studentId,
    {$addToSet: {"answeredQuestions": req.body.questionID}},
    {safe: true, upsert: true, new : true},
    function(err) {
        console.log('Error:',err);
    }

    );*/
    /*var query = {'title': req.body.title}
    AnsweredQuestions.findOneAndUpdate(query,{
      title: req.body.title,
      correct: req.body.correct,
      answer2: req.body.answer2,
      answer3: req.body.answer3,
      answer4: req.body.answer4,
      studentID: req.body.studentId
      },{upsert:true});*/

     const questions = new AnsweredQuestions ({
      title: req.body.title,
      correct: req.body.correct,
      answer2: req.body.answer2,
      answer3: req.body.answer3,
      answer4: req.body.answer4,
      studentID: req.body.studentId
      })
      questions.save().then(result => {
        res.status(201).json({
          message: 'Post added successfully to AQ',
        });
      });
    console.log('Done');
})

router.get("/:id",  (req,res,next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;

  const questionQuery = AnsweredQuestions.find({studentID: req.params.id});
  //console.log("Heyyy",queriedQuestion);
  let fetchedQ;
  // if(pageSize && currentPage)
  // {
  //   questionQuery
  //   .skip(pageSize*(currentPage - 1))
  //   .limit(pageSize);
  // }
  questionQuery.then(documents => {
    fetchedQ = documents;
    return AnsweredQuestions.count();
  })
  .then(count => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      questions: fetchedQ,
      maxQuestions: count
    });
  });

})

module.exports = router;
