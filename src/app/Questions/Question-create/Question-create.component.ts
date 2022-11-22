import { identifierName } from "@angular/compiler";
import { Component, OnInit} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Question } from "../Question.model";


import { QuestionsService } from "../Questions.service";

@Component({
  selector: 'app-question-create',
  templateUrl: './Question-create.component.html',
  styleUrls: ['./Question-create.component.css']
})
export class QuestionCreateComponent implements OnInit
{
  enteredTitle = "";
  enteredContent = "";
  Question: Question;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = "create";
  private questionId: string;

  constructor(public questionsService: QuestionsService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required,Validators.minLength(3)]
      }),
      correct: new FormControl(null, {
        validators: [Validators.required]
      }),
      answer2: new FormControl(null, {
        validators: [Validators.required]
      }),
      answer3: new FormControl(null),
      answer4: new FormControl(null)
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) =>{
      if(paramMap.has('questionId'))
      {
        console.log('here');
        this.mode = 'edit';
        this.questionId = paramMap.get('questionId');
        this.isLoading = true;
        this.questionsService.getQuestion(this.questionId).subscribe(QuestionData => {
          this.isLoading = false;
          this.Question = {id: QuestionData._id, title: QuestionData.title, correct: QuestionData.correct, answer2: QuestionData.answer2, answer3:QuestionData.answer3, answer4:QuestionData.answer4, creator: QuestionData.creator};
          this.form.setValue({title: this.Question.title,correct: this.Question.correct, answer2: this.Question.answer2, answer3: this.Question.answer3, answer4: this.Question.answer4 });
        });
      } else {
        this.mode = 'create';
        this.questionId = null;
      }
    } );
  }

  onSaveQuestion() {
    if(this.form.invalid)
    {
      return;
    }
    this.isLoading=true;
    if(this.mode === 'create'){
      this.questionsService.addQuestion(this.form.value.title,this.form.value.correct,this.form.value.answer2,this.form.value.answer3,this.form.value.answer4);

    } else {
      this.questionsService.updateQuestion(this.questionId,this.form.value.title,this.form.value.correct,this.form.value.answer2,this.form.value.answer3,this.form.value.answer4);
    }
    this.form.reset();
  }
}
