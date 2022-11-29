import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from "rxjs";
import { map } from "rxjs/operators"
import { AuthService } from "src/app/auth/auth.service";

import { Question } from './Question.model';
import { response } from 'express';
import { Router } from '@angular/router';


@Injectable({providedIn: 'root'})
export class QuestionsService{
  private questions: Question[] = [];
  private questionsUpdated = new Subject<{questions:Question[],questionCount:number}>();
  Question : Question
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  getQuestions(questionsPerPage:number, currentPage: number)
  {
    const queryParams = `?pagesize=${questionsPerPage}&page=${currentPage}`;
    this.http
    .get<{message: string, questions: any, maxQuestions: number}>(
      'http://localhost:3000/api/posts' + queryParams)
      .pipe(
        map(questionData => {
        return {
          questions: questionData.questions.map(question => {
          return {
            title: question.title,
            correct: question.correct,
            answer2: question.answer2,
            answer3: question.answer3,
            answer4: question.answer4,
            id: question._id,
            creator: question.creator
          };
        }),
        maxQuestions:questionData.maxQuestions
      };
    })
    )
    .subscribe((transformedQuestionsData) => {
      //console.log(transformedQuestionsData);
      this.questions = transformedQuestionsData.questions;
      this.questionsUpdated.next({
        questions: [...this.questions],
        questionCount: transformedQuestionsData.maxQuestions
      });
    });
  }

  getQuestionsStudent(questionsPerPage:number, currentPage: number)
  {
    const studentId = this.authService.getUserId()
    const queryParams = `?pagesize=${questionsPerPage}&page=${currentPage}}`;
    this.http
    .get<{message: string, questions: any, maxQuestions: number}>(
      'http://localhost:3000/api/question/' + studentId )
      .pipe(
        map(questionData => {
        return {
          questions: questionData.questions.map(question => {
          return {
            title: question.title,
            correct: question.correct,
            answer2: question.answer2,
            answer3: question.answer3,
            answer4: question.answer4,
            id: question._id
          };
        }),
        maxQuestions:questionData.maxQuestions
      };
    })
    )
    .subscribe((transformedQuestionsData) => {
      console.log(transformedQuestionsData);
      this.questions = transformedQuestionsData.questions;
      this.questionsUpdated.next({
        questions: [...this.questions],
        questionCount: transformedQuestionsData.maxQuestions
      });
    });
  }

  getQuestionUpdateListener()
  {
    return this.questionsUpdated.asObservable();
  }


  getQuestion(id:string){
    return this.http.get<{_id: string, title: string, correct: string, answer2:string,answer3:string,answer4:string, creator: string}>("http://localhost:3000/api/posts/"+ id);
  }

  addQuestion(title: string, correct: string,answer2:string,answer3:string,answer4:string)
  {
    const question: Question = {id:null, title:title,correct:correct,answer2: answer2, answer3:answer3, answer4:answer4,creator:null}
    this.http.post<{message: string, correct:string, answer2:string, answer3:string,answer4:string, questionId: string}>('http://localhost:3000/api/posts', question)
    .subscribe((responseData) => {
      this.router.navigate(["/"]);
    })

  }

  updateQuestion(id:string, title:string, correct:string,answer2:string,answer3:string,answer4:string)
  {
    const question: Question = { id:id, title:title, correct: correct, answer2: answer2, answer3:answer3, answer4:answer4,creator: null};
    //console.log(post.answer2);
    this.http.put("http://localhost:3000/api/posts/"+ id,question)
    .subscribe(response => {
      this.router.navigate(["/"]);
    });
  }

  deleteQuestion(questionId: string) {
   return this.http
   .delete("http://localhost:3000/api/posts/"+ questionId);

  }
  getRandomQuestion(){
    return this.http.get<{_id: string, title: string, correct: string, answer2:string,answer3:string,answer4:string, creator: string}>(
      "http://localhost:3000/api/question")
  }
  sendQuestionId(questionID:string)
  {
    this.getQuestion(questionID).subscribe(QuestionData => {
      this.Question = {id: QuestionData._id, title: QuestionData.title, correct: QuestionData.correct, answer2: QuestionData.answer2, answer3:QuestionData.answer3, answer4:QuestionData.answer4, creator: QuestionData.creator};
      const studentInfo = {questionID: questionID,studentId: this.authService.getUserId(),title: this.Question.title,correct: this.Question.correct, answer2: this.Question.answer2, answer3: this.Question.answer3, answer4: this.Question.answer4};
      return this.http.put("http://localhost:3000/api/question" , studentInfo).subscribe(response => {

      });
    })



  }
  getStudentQuestions(studentId:string)
  {
    return this.http.get<{_id: string, title: string, correct: string, answer2:string,answer3:string,answer4:string, creator: string}>(
      "http://localhost:3000/api/question/" + studentId)
  }
}
