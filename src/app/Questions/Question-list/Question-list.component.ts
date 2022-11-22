import { Component, OnDestroy, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";

import { Question } from '../Question.model';
import { QuestionsService } from "../Questions.service";

@Component({
  selector: 'app-question-list',
  templateUrl: './Question-list.component.html',
  styleUrls: ['Question-list.component.css']
})

export class QuestionListComponent implements OnInit, OnDestroy {
 /*  posts = [
    {title: 'First Post', content: 'This is the first post\'s content'},
    {title: 'Second Post', content: 'This is the Second post\'s content'},
    {title: 'Third Post', content: 'This is the Third post\'s content'}
  ]; option shift a for multi comment */
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

  constructor(public questionsService: QuestionsService, private authService: AuthService ) {}

  ngOnInit() {
    this.isLoading = true;
    this.questionsService.getQuestions(this.questionsPerPage,this.currentPage);
    this.userId = this.authService.getUserId();
    this.questionsSub = this.questionsService.getQuestionUpdateListener().subscribe((questionData:{questions: Question[], questionCount: number}) => {
      this.isLoading=false;
      this.totalQuestions = questionData.questionCount;
      this.questions = questionData.questions;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onChangedPage(pageData: PageEvent)
  {
    this.isLoading=true;
    this.currentPage= pageData.pageIndex + 1;
    this.questionsPerPage = pageData.pageSize;
    this.questionsService.getQuestions(this.questionsPerPage,this.currentPage);
  }

  onDelete(questionID: string) {
    this.isLoading;
    this.questionsService.deleteQuestion(questionID).subscribe(() => {
      this.questionsService.getQuestions(this.questionsPerPage,this.currentPage);
    });
  }

  ngOnDestroy() {
    this.questionsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
