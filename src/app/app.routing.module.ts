import { NgModule } from "@angular/core";
import { RouterModule,Routes } from "@angular/router";
import { AuthGuard } from "./auth/auth.guard";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { QuestionCreateComponent } from "./Questions/Question-create/Question-create.component";
import { QuestionListComponent } from "./Questions/Question-list/Question-list.component";
import { QuestionSelectComponent } from "./Questions/Question-select/Question-select.component";
import { QuestionListStudent } from "./Questions/Question-list-student/Question-list-student.component";

const routes: Routes = [
  {path: '',component: QuestionListComponent},
  {path: 'create', component:QuestionCreateComponent, canActivate: [AuthGuard]},
  {path: 'edit/:questionId', component:QuestionCreateComponent, canActivate: [AuthGuard]},
  {path: 'question', component:QuestionSelectComponent, canActivate: [AuthGuard]},
  {path: 'question/:studentId', component:QuestionListStudent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
