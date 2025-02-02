import { Component } from '@angular/core';
import { SentimentNavComponent } from "../sentiment-nav/sentiment-nav.component";

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [SentimentNavComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {

}
