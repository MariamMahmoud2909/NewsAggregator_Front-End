import { Component, inject, OnInit } from '@angular/core';
import { ArticleService } from '../../core/servcies/article.service';
import { NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss'
})
export class ArticleComponent implements OnInit {
  article: any;
  constructor(private route: ActivatedRoute, private http: HttpClient) {}
  private readonly _ArticleService=inject(ArticleService)

  ngOnInit(): void {
    const articleId = this.route.snapshot.paramMap.get('id');
    if (articleId) {
      this._ArticleService.getArticlebyId(articleId);
    }
  }

}
