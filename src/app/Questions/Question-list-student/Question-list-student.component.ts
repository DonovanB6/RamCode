import { Component, OnDestroy, OnInit } from "@angular/core";

import { AuthService } from "src/app/auth/auth.service";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";

import { Question } from '../Question.model';
import { QuestionsService } from "../Questions.service";

@Component({
  selector: 'app-question-list-student',
  templateUrl: './Question-list-student.component.html',
  styleUrls: ['Question-list-student.component.css']
})
export class QuestionListStudent implements OnInit, OnDestroy
{
  constructor(public questionsService: QuestionsService, private authService: AuthService) {}
  uniqueQuestion: Question[] = [];
  questions: Question[] = [];
  isLoading = false;
  totalQuestions=10;
  questionsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10];
  userIsAuthenticated = false;
  userId: string;
  private questionsSub: Subscription;
  private authStatusSub: Subscription;
 userRole: string;


 ngOnInit() {
   this.isLoading = true;

   this.questionsService.getQuestionsStudent(this.questionsPerPage,this.currentPage);
   this.userId = this.authService.getUserId();
   this.questionsSub = this.questionsService.getQuestionUpdateListener().subscribe((questionData:{questions: Question[], questionCount: number}) => {
     this.isLoading=false;
     this.totalQuestions = questionData.questionCount;
     this.questions = questionData.questions;
     console.log("Hi",this.questions);

     const uniqueIds = [];
      this.uniqueQuestion = this.questions.filter(element => {
      const isDuplicate = uniqueIds.includes(element.title);

      if (!isDuplicate) {
      uniqueIds.push(element.title);

      return true;
    }

    return false;
  });
     console.log(this.uniqueQuestion);
   });
   this.userIsAuthenticated = this.authService.getIsAuth();
   this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
     this.userIsAuthenticated = isAuthenticated;
     this.userId = this.authService.getUserId();
   });
  this.userRole = this.authService.getUserRole();

 }

 onChangedPage(pageData: PageEvent)
 {
   this.isLoading=true;
   this.currentPage= pageData.pageIndex + 1;
   this.questionsPerPage = pageData.pageSize;
   this.questionsService.getQuestionsStudent(this.questionsPerPage,this.currentPage);
 }

 onDelete(questionID: string) {
   this.isLoading;
   this.questionsService.deleteQuestion(questionID).subscribe(() => {
     this.questionsService.getQuestionsStudent(this.questionsPerPage,this.currentPage);
   });
 }

 ngOnDestroy() {
   this.questionsSub.unsubscribe();
   this.authStatusSub.unsubscribe();
 }



}
