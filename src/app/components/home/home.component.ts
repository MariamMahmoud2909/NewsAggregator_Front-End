import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { SentimentNavComponent } from "../sentiment-nav/sentiment-nav.component";
import { INews } from '../../core/interfaces/inews'; // Import the interface
import { NgFor, NgIf, KeyValuePipe, CommonModule } from '@angular/common';  // Import KeyValuePipe
import { CategoriesService } from '../../core/servcies/categories.service';
import { ICategories } from '../../core/interfaces/icategories';
import { NewsService } from './../../core/servcies/news.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SentimentNavComponent, NgFor, NgIf, KeyValuePipe, CommonModule],  // Include KeyValuePipe
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private readonly _NewsService = inject(NewsService);
  private readonly _CategoriesService = inject(CategoriesService);
  private cdr: ChangeDetectorRef;

  public recentNews: INews[] = [];
  public trendingNews: INews[] = [];
  public otherNews: INews[] = [];
  public firstPartNews: INews[] = [];
  public secondPartNews: INews[] = [];

  categoryStates: { [key: string]: boolean } = {}; // Track by news ID
  categoriesadd: string[] = []; // Array of categories to be displayed for each news
  addedCategories: Set<string> = new Set();
  favoriteStates: { [key: string]: boolean } = {};

  public categories: { [key: string]: INews[] } = {
    'business': [],
    'sport': [],
    'tech': [],
    'entertainment': [],
    'gaming': [],
    'news': [],
  };

  // Bookmarked news
  bookmarkedNews: Set<string> = new Set<string>();

  constructor(cdr: ChangeDetectorRef) {
    this.cdr = cdr;
  }

  ngOnInit(): void {
    this._NewsService.getAllNews().subscribe({
      next: (res) => {
        console.log('Full News Array:', res);

        // Assign the categories for each section
        this.recentNews = res.slice(10, 17);
        this.trendingNews = res.slice(17, 20);
        this.otherNews = res.slice(20, 80);  // All other news

        const categoryList = Object.keys(this.categories); // List of all categories
        this.loadBookmarks();

        const savedBookmarks = localStorage.getItem('bookmarkedNews');
        if (savedBookmarks) {
          this.bookmarkedNews = new Set(JSON.parse(savedBookmarks)); // Load from localStorage
        } else {
          this.bookmarkedNews = new Set();
        }

        const savedFavorites = localStorage.getItem('favoriteStates');
        if (savedFavorites) {
          this.favoriteStates = JSON.parse(savedFavorites); // Load saved favorite states
        }

        // Here we want to assign 6 unique categories to 6 different cards
        let currentCategoryIndex = 0;
        this.otherNews.slice(0, 6).forEach((newsItem) => {
          newsItem.topic = categoryList[currentCategoryIndex % categoryList.length]; // Assign a unique category
          currentCategoryIndex++;
        });

        console.log('Assigned categories to first 6 news items:', this.otherNews.slice(0, 6));

        // Now categorize the rest of the news
        res.forEach(newsItem => {
          if (this.categories[newsItem.topic]) {
            this.categories[newsItem.topic].push(newsItem);
          }
        });

        // Optional: Limit to 3 items per category
        Object.keys(this.categories).forEach(category => {
          this.categories[category] = this.categories[category].slice(0, 3);
        });
      },
      error: (err) => console.log(err),
    });
  }

  //Add category button
  onAddCategory(newsId: string, category: string): void {
    const categoryKey = `${newsId}_${category}`;

    if (!this.categoryStates[categoryKey]) {
      this._CategoriesService.addCategory(category).subscribe({
        next: () => {
          console.log(`Category ${category} added successfully for newsId ${newsId}`);
          this.categoryStates[categoryKey] = true; // Update the state for this specific category and newsId
        },
        error: (err) => {
          console.error(`Error adding category ${category}, err`);
        }
      });
    }
  }

  // Get button text based on the category state
  getButtonText(newsId: string, category: string): string {
    const categoryKey = `${newsId}_${category}`;
    return this.categoryStates[categoryKey] ? 'Category Added' : 'Add Category';
  }

  //Favorite
  toggleFavorite(newsId: string): void {
    // Toggle the favorite state for the specific newsId
    this.favoriteStates[newsId] = !this.favoriteStates[newsId];

    // Save the updated favorite states to localStorage
    localStorage.setItem('favoriteStates', JSON.stringify(this.favoriteStates));
  }

  //Saved News
  loadBookmarks(): void {
    const savedBookmarks = localStorage.getItem('bookmarkedNews');
    if (savedBookmarks) {
      this.bookmarkedNews = new Set<string>(JSON.parse(savedBookmarks));
    }
  }

  // Function to check if the news item is bookmarked
  toggleBookmark(event: Event, newsId: string): void {
    event.stopPropagation(); // Prevent the default action

    const bookmarkElement = event.target as HTMLElement;

    if (this.isBookmarked(newsId)) {
      this._NewsService.RemoveFromBookmarks(newsId).subscribe({
        next: () => {
          this.bookmarkedNews.delete(newsId);
          this.saveBookmarks();
          bookmarkElement.classList.remove('fa-solid', 'fa-bookmark', 'text-black');
          bookmarkElement.classList.add('fa-regular', 'fa-bookmark', 'text-gray');
        },
        error: (err) => console.error('Error removing from bookmarks:', err),
      });
    } else {
      this._NewsService.AddToFavorites(newsId).subscribe({
        next: (res) => {
          console.log(res);
          this.bookmarkedNews.add(newsId);
          this.saveBookmarks();
          bookmarkElement.classList.remove('fa-regular', 'fa-bookmark', 'text-gray');
          bookmarkElement.classList.add('fa-solid', 'fa-bookmark', 'text-black');
        },
        error: (err) => console.error('Error adding to bookmarks:', err),
      });
    }
  }



  // Helper function to check if a news item is bookmarked
  isBookmarked(newsId: string): boolean {
    return this.bookmarkedNews.has(newsId);
  }

  // Function to save bookmarks to localStorage
  saveBookmarks(): void {
    localStorage.setItem('bookmarkedNews', JSON.stringify(Array.from(this.bookmarkedNews)));
  }
}
