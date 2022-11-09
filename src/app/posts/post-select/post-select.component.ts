import { Component } from "@angular/core";
import { MatRadioGroup, MatRadioButton } from "@angular/material/radio";

@Component({
  selector: 'app-post-select',
  templateUrl: './post-select.component.html',
  styleUrls: ['post-select.component.css']
})

export class PostSelectComponent{
  favoriteSeason: string;
  seasons: string[] = ['Winter', 'Spring', 'Summer', 'Autumn'];
}
