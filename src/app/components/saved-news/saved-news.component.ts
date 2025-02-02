import { Component, inject, OnInit } from '@angular/core';
import { SentimentNavComponent } from "../sentiment-nav/sentiment-nav.component";
import { SavedNewsService } from '../../core/servcies/saved-news.service';
import { INews } from '../../core/interfaces/inews';
import { CommonModule, NgIf } from '@angular/common';
import { NewsService } from '../../core/servcies/news.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-saved-news',
  standalone: true,
  imports: [SentimentNavComponent,NgIf,CommonModule],
  templateUrl: './saved-news.component.html',
  styleUrl: './saved-news.component.scss'
})
export class SavedNewsComponent implements OnInit{
    private readonly _SavedNewsService=inject(SavedNewsService);
    private readonly _NewsService = inject(NewsService)

    public savedNews: INews[] = [];
    favoriteStates: { [key: string]: boolean } = {};

    ngOnInit(): void {
      // Fetch saved news when the component initializes
      this._SavedNewsService.getSavedNews().subscribe({
        next: (res) => {
          this.savedNews = res;  // Store the result in the savedNews array
          console.log('Saved News:', res);  // For debugging, you can remove this later
          const savedFavorites = localStorage.getItem('favoriteStates');
          if (savedFavorites) {
            this.favoriteStates = JSON.parse(savedFavorites); // Load saved favorite states
          }
        },
        error: (err) => console.log('Error fetching saved news:', err),
      });
    }

    toggleFavorite(newsId: string): void {
      this.favoriteStates[newsId] = !this.favoriteStates[newsId];

      localStorage.setItem('favoriteStates', JSON.stringify(this.favoriteStates));
    }

    removeFromBookmarks(newsId: string) {
      this._NewsService.RemoveFromBookmarks(newsId).subscribe({
        next: () => {
          // Remove the article from the local savedNews array
          this.savedNews = this.savedNews.filter(news => news._Id !== newsId);
        },
        error: (err) => {
          console.error('Error removing from bookmarks:', err);
        }
      });
    }

    constructor(private router: Router) {}

    goToArticle(articleId: string): void {
      this.router.navigate(['/article', articleId]);
    }

}
