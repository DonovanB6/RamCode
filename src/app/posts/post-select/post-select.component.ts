import { Component, OnInit } from "@angular/core";
import { Post } from "../post.model";

import { PostsService } from "../posts.service";

@Component({
  selector: 'app-post-select',
  templateUrl: './post-select.component.html',
  styleUrls: ['post-select.component.css']
})

export class PostSelectComponent implements OnInit{

  constructor(public postsService: PostsService) {}
  post:Post;
  favoriteSeason: string;
  selectedAnswer: string;
  AnswerChecked = "";
  rightAnswer = false;
  seasons: string[] = ['Winter', 'Spring', 'Summer', 'Autumn'];
  answersF: string[] = [];
  ngOnInit()
  {
    this.postsService.getRandomPost().subscribe(postData => {
      this.post = {id: postData._id, title: postData.title, content: postData.content, answer2: postData.answer2, answer3:postData.answer3, answer4:postData.answer4, creator: postData.creator};
      //console.log(this.post);
      this.randomizeAnswers(this.post);
    })

    // var choice1 = answers[Math.random() * answers.length];
  }
  randomizeAnswers(post:Post)
  {
    //console.log(post);
    var answers = [post.content,post.answer2,post.answer3,post.answer4];
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
    if(selectedAnswer==this.post.content)
    {
      this.AnswerChecked = "Correct!";
      this.rightAnswer = true;
    }
    else
    {
      this.AnswerChecked = "Incorrect";
    }
    console.log(this.AnswerChecked);
  }
}
