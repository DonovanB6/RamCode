import { identifierName } from "@angular/compiler";
import { Component, OnInit} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";


import { PostsService } from "../posts.service";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit
{
  enteredTitle = "";
  enteredContent = "";
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = "create";
  private postId: string;

  constructor(public postsService: PostsService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required,Validators.minLength(3)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required]
      }),
      answer2: new FormControl(null, {
        validators: [Validators.required]
      }),
      answer3: new FormControl(null),
      answer4: new FormControl(null)
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) =>{
      if(paramMap.has('postId'))
      {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {id: postData._id, title: postData.title, content: postData.content, answer2: postData.answer2, answer3:postData.answer3, answer4:postData.answer4, creator: postData.creator};
          this.form.setValue({title: this.post.title,content: this.post.content, answer2: this.post.answer2, answer3: this.post.answer3, answer4: this.post.answer4 });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    } );
  }

  onSavePost() {
    if(this.form.invalid)
    {
      return;
    }
    this.isLoading=true;
    if(this.mode === 'create'){
      this.postsService.addPost(this.form.value.title,this.form.value.content,this.form.value.answer2,this.form.value.answer3,this.form.value.answer4);

    } else {
      this.postsService.updatePost(this.postId,this.form.value.title,this.form.value.content,this.form.value.answer2,this.form.value.answer3,this.form.value.answer4);
    }
    this.form.reset();
  }
}
