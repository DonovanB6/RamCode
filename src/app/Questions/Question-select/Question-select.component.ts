import { Component, OnInit } from "@angular/core";
import { Question } from "../Question.model";

import { QuestionsService } from "../Questions.service";

@Component({
  selector: 'app-question-select',
  templateUrl: './Question-select.component.html',
  styleUrls: ['Question-select.component.css']
})

export class QuestionSelectComponent implements OnInit{

  constructor(public questionsService: QuestionsService) {}
  question:Question;

  selectedAnswer: string;
  AnswerChecked = "";
  rightAnswer = false;

  answersF: string[] = [];
  ngOnInit()
  {
    this.questionsService.getRandomQuestion().subscribe(questionData => {
      this.question = {id: questionData._id, title: questionData.title, correct: questionData.correct, answer2: questionData.answer2, answer3:questionData.answer3, answer4:questionData.answer4, creator: questionData.creator};
      //console.log(this.post);
      this.randomizeAnswers(this.question);
    })

    // var choice1 = answers[Math.random() * answers.length];
  }
  randomizeAnswers(question:Question)
  {
    //console.log(post);
    var answers = [question.correct,question.answer2,question.answer3,question.answer4];
   //console.log(answers);
    var answersRand = [];

     while(answers.length>0)
     {

      var i = Math.floor(Math.random() * (answers.length));
      if(answers!= null || undefined)
      {
        answersRand.push(answers[i]);
        answers.splice(i, 1);
      }
     }
     this.answersF = answersRand;
     console.log(this.answersF);

  }
  checkAnswer(selectedAnswer)
  {
    if(selectedAnswer==this.question.correct)
    {
      this.AnswerChecked = "Correct!";
      this.rightAnswer = true;
      this.questionsService.sendQuestionId(this.question.id);

    }
    else
    {
      this.AnswerChecked = "Incorrect";
    }
    console.log(this.AnswerChecked);
  }
}
