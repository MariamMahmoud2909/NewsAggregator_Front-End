import { Component, inject, OnInit } from '@angular/core';
import { SentimentNavComponent } from "../sentiment-nav/sentiment-nav.component";
import { SavedNewsService } from '../../core/servcies/saved-news.service';
import { INews } from '../../core/interfaces/inews';
import { CommonModule, NgIf } from '@angular/common';
import { NewsService } from '../../core/servcies/news.service';
import { Router } from '@angular/router';
import { CommentPopUpComponent } from '../comment-pop-up/comment-pop-up.component';

@Component({
    selector: 'app-saved-news',
    imports: [SentimentNavComponent, NgIf, CommonModule,CommentPopUpComponent],
    templateUrl: './saved-news.component.html',
    styleUrl: './saved-news.component.scss'
})
export class SavedNewsComponent implements OnInit{
    private readonly _SavedNewsService=inject(SavedNewsService);
    private readonly _NewsService = inject(NewsService)

    public savedNews: INews[] = [];
    favoriteStates: { [key: string]: boolean } = {};
    likeCounts: { [key: string]: number } = {};   

    selectedArticleId: string | null = null;
  showPopup: boolean = false;
  userId: string = '';

    openCommentPopup(articleId: string,event: Event) {
      event.stopPropagation();
      this.selectedArticleId = articleId;
      this.showPopup = true;
    }
    
    closeCommentPopup() {
      this.showPopup = false;
    }
    
    categoryMap: { [key: string]: string } = {
      stockmarketinformationandanalysis: 'Stock Market',
      newsandcareerportal: 'Career News',
      newsandmedia: 'Media News',
      tech: 'Technology',
      world: 'World News',
    };
  
    getCategoryDisplayName(category: string): string {
      return this.categoryMap[category] || category; // Fallback to original category name
    }
  

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

          this._NewsService.getUserId().subscribe(user => {
            this.userId = user.id;
            const savedFavorites = localStorage.getItem(`favoriteStates_${this.userId}`);
            if (savedFavorites) {
              this.favoriteStates = JSON.parse(savedFavorites);
            }
          });
        },
        error: (err) => console.log('Error fetching saved news:', err),
      });


    }

   // Favorite
  toggleFavorite(newsId: string, event: Event): void {
    event.stopPropagation();
  
    const wasFavorited = this.favoriteStates[newsId] || false;
    this.favoriteStates[newsId] = !wasFavorited;
  
    // Update the like count
    if (!this.likeCounts[newsId]) {
      this.likeCounts[newsId] = 0;
    }
  
    if (this.favoriteStates[newsId]) {
      this.likeCounts[newsId]++;
    } else {
      this.likeCounts[newsId] = Math.max(0, this.likeCounts[newsId] - 1); // prevent negative
    }
  
    // Save both to localStorage
    if (this.userId) {
      localStorage.setItem(`favoriteStates_${this.userId}`, JSON.stringify(this.favoriteStates));
    }
    localStorage.setItem('likeCounts', JSON.stringify(this.likeCounts));
  }

    removeFromBookmarks(newsId: string) {
      this._NewsService.RemoveFromBookmarks(newsId).subscribe({
        next: () => {
          this.savedNews = this.savedNews.filter(news => news._Id !== newsId);
          this._NewsService.notifyBookmarkChange(newsId); // Notify HomeComponent
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
