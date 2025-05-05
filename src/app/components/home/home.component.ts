import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { SentimentNavComponent } from "../sentiment-nav/sentiment-nav.component";
import { INews } from '../../core/interfaces/inews';
import { NgFor, NgIf, KeyValuePipe, CommonModule } from '@angular/common';
import { CategoriesService } from '../../core/servcies/categories.service';
import { ICategories } from '../../core/interfaces/icategories';
import { NewsService } from './../../core/servcies/news.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ArticleService } from '../../core/servcies/article.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommentPopUpComponent } from "../comment-pop-up/comment-pop-up.component";
import { NavBlankComponent } from "../nav-blank/nav-blank.component";
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';                   
import { Observable } from 'rxjs';  
import { of, forkJoin } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

interface RecommendationResult {
  title: string;
  summary: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SentimentNavComponent, NgFor, NgIf, KeyValuePipe, CommonModule, ReactiveFormsModule, RouterLink, CommentPopUpComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private readonly _NewsService = inject(NewsService);
  private readonly _CategoriesService = inject(CategoriesService);
  private cdr: ChangeDetectorRef;

  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _ArticleService = inject(ArticleService);
  private readonly _ToastrService=inject(ToastrService)


  public recentNews: INews[] = [];
  public trendingNews: INews[] = [];
  public moreNews: INews[] = [];
  public otherNews: INews[] = [];
  public diverseFeed: any[] = [];
  public categories: { [key: string]: INews[] } = {};
  categoryStates: { [key: string]: boolean } = {};
  bookmarkedNews: Set<string> = new Set<string>();  // Ensuring only string IDs
  favoriteStates: { [key: string]: boolean } = {};
  private userId: string = ''
  filteredNews: any[] = [];
  allNews: INews[] = [];
  displayedNews: INews[] = [];
  selectedArticleId: string | null = null;
  showPopup: boolean = false;
  currentPage: number = 1;
  pageSize: number = 80;
  totalPages: number = 3;
  totalPagesArray: number[] = [];
  likeCounts: { [key: string]: number } = {};   

  private readonly http = inject(HttpClient);

  private recommendationUrl = 'https://localhost:7291/api/Recommendation/getRecommendations';

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

  constructor(cdr: ChangeDetectorRef,private router : Router,private _ActivatedRoute : ActivatedRoute) {
    this.cdr = cdr;
  }

  isLoading:boolean = false;


  surveyForm:FormGroup = this._FormBuilder.group({
      SourceDiscovery:[null],
      VisitFrequency:[null],
      IsLoadingSpeedSatisfactory:[null],
      NavigationEaseRating:[null]
      })


      surveySubmit():void
      {
        if(this.surveyForm.valid)
        {
          this.isLoading = true;
          this._ArticleService.setSurvey(this.surveyForm.value).subscribe({
            next:(res)=>{
              console.log(res);
              this.surveyForm.reset();
              this.isLoading = false;
              this._ToastrService.success("Success",res.message)
            },
            error:(err:HttpErrorResponse)=>{
              console.log(err);
              this.isLoading = false;
            },
          })
        }
      }
      
  // ngOnInit(): void {
    
  //   this._CategoriesService.getAllCategories().subscribe({
  //     next: (categories) => {
  //       console.log('Categories:', categories);

  //       // Limit categories to the first 6
  //       const limitedCategories = categories.slice(0, 6);
  //       limitedCategories.forEach(category => {
  //         this.categories[category] = [];
  //       });

  //       // Fetch articles for each category
  //       limitedCategories.forEach(category => {
  //         this._NewsService.getArticleByCategory(category).subscribe({
  //           next: (articles) => {
  //             this.categories[category] = articles.slice(0, 3);
  //           },
  //           error: (err) => console.log('Error fetching articles for category:', category, err),
  //         });
  //       });
  //     },
  //     error: (err) => console.log('Error fetching categories:', err),
  //   });

  //   this._NewsService.bookmarkChange$.subscribe(newsId => {
  //     if (newsId) {
  //       if (this.bookmarkedNews.has(newsId)) {
  //         this.bookmarkedNews.delete(newsId);
  //         this.saveBookmarks(); // Save after deletion
  //         this.cdr.detectChanges(); // Force UI update
  //       }
  //     }
  //   });
    
  //   this.fetchNews();
  // }


  // fetchNews(): void {
  //   this._NewsService.getAllNews(this.currentPage, this.pageSize).subscribe({
  //     next: (res) => {
  //       console.log('API Response:', res);
  
  //       this.allNews = res;  // ✅ Store only the paginated news
  //       this.filteredNews = res;  

  //       // ✅ Keep totalPages static (3 pages)
  //       this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  
  //       this.updateDisplayedNews();

  
  //       // ✅ Move these assignments OUTSIDE `queryParams.subscribe`
  //       this.recentNews = this.filteredNews.slice(0, 7);
  //       this.trendingNews = this.filteredNews.slice(7, 10);
  //       this.moreNews = this.filteredNews.slice(10, 22);
  //       this.otherNews = this.getUniqueCategoryNews(this.filteredNews.slice(22, 80));  // ✅ No overlap
  
  //       // ✅ Now apply filters based on query parameters
  //       this._ActivatedRoute.queryParams.subscribe(params => {
  //         const type = params['type'];
  //         this.applyFilter(type);  // Keep filtering inside
  //       });
  
  //       const savedLikes = localStorage.getItem('likeCounts');
  //       if (savedLikes) {
  //         this.likeCounts = JSON.parse(savedLikes);
  //       }

  //       this.cdr.detectChanges();
  //       this.loadBookmarks();

  //       this._NewsService.getUserId().subscribe(user => {
  //         this.userId = user.id;  // Get the current user's ID

  //         // Load the favorite states from localStorage for the specific user
  //         const savedFavorites = localStorage.getItem(`favoriteStates_${this.userId}`);
  //         if (savedFavorites) {
  //           this.favoriteStates = JSON.parse(savedFavorites);
  //         }
  //         this.loadSavedCategories();
  //       });
  //     },
  //     error: (err) => console.log('API Error:', err),
  //   });
  // }

  ngOnInit(): void {
    this._CategoriesService.getAllCategories().subscribe({
      next: (preferredCategories: string[]) => {
        const allNews: any[] = []; // diverse shuffled feed
        const newsRequests: Observable<any[]>[] = [];
  
        preferredCategories.forEach(category => {
          this.categories[category] = []; 
          newsRequests.push(
            this._NewsService.getArticleByCategory(category).pipe(
              tap((articles) => {
                this.categories[category] = articles.slice(0, 3); // category-specific display
                allNews.push(...articles); 
              }),
              catchError((err) => {
                console.error(`Error fetching news for category ${category}:`, err);
                return of([]);
              })
            )
          );
        });
  
        // Wait until all category requests complete
        forkJoin(newsRequests).subscribe(() => {
          //diverseFeed any[] = [];
          //this.diverseFeed = this.shuffleArray(allNews); 
          this.cdr.detectChanges(); 
        });
      },
      error: (err) => console.error('Error fetching user preferred categories:', err),
    });
  
    this._NewsService.bookmarkChange$.subscribe(newsId => {
      if (newsId && this.bookmarkedNews.has(newsId)) {
        this.bookmarkedNews.delete(newsId);
        this.saveBookmarks();
        this.cdr.detectChanges();
      }
    });    
    //this.fetchNews();
  }
  
  fetchRecommendations(topic: string): Observable<RecommendationResult[]> {
    return this.http.post<RecommendationResult[]>(
      this.recommendationUrl,
      { topic }
    );
  }


  fetchNews(): void {
    this._NewsService.getAllNews(this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        console.log('API Response:', res);
  
        this.allNews = res;  // ✅ Store only the paginated news
        this.filteredNews = res;  

        // ✅ Keep totalPages static (3 pages)
        this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  
        this.updateDisplayedNews();

  
        // ✅ Move these assignments OUTSIDE `queryParams.subscribe`
        this.recentNews = this.filteredNews.slice(0, 7);
        this.trendingNews = this.filteredNews.slice(7, 10);
        this.moreNews = this.filteredNews.slice(10, 22);
        this.otherNews = this.getUniqueCategoryNews(this.filteredNews.slice(22, 80));  // ✅ No overlap
  
        // ✅ Now apply filters based on query parameters
        this._ActivatedRoute.queryParams.subscribe(params => {
          const type = params['type'];
          this.applyFilter(type);  // Keep filtering inside
        });
  
        this.cdr.detectChanges();
        this.loadBookmarks();

        this._NewsService.getUserId().subscribe(user => {
          this.userId = user.id;  // Get the current user's ID

          // Load the favorite states from localStorage for the specific user
          const savedFavorites = localStorage.getItem(`favoriteStates_${this.userId}`);
          if (savedFavorites) {
            this.favoriteStates = JSON.parse(savedFavorites);
          }
          this.loadSavedCategories();
        });
      },
      error: (err) => console.log('API Error:', err),
    });
  }

  applyFilter(type: string): void {
    if (type === 'positive') {
        // Filter for even IDs (Positive News)
        this.filteredNews = this.allNews.filter(news => parseInt(news._Id, 10) % 2 === 0);
    } else if (type === 'negative') {
        // Filter for odd IDs (Negative News)
        this.filteredNews = this.allNews.filter(news => parseInt(news._Id, 10) % 2 !== 0);
    } else {
        // Show all news
        this.filteredNews = this.allNews;
    }

    // ✅ Update paginated news AFTER filtering
    this.updateNewsSections();
    this.updateDisplayedNews();
    this.cdr.detectChanges();
}

updateNewsSections(): void {
    this.recentNews = this.filteredNews.slice(0, 7);
    this.trendingNews = this.filteredNews.slice(7, 10);
    this.moreNews = this.filteredNews.slice(10, 22);
    this.otherNews = this.getUniqueCategoryNews(this.filteredNews.slice(22, 80));
}


  updateDisplayedNews(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedNews = this.filteredNews.slice(startIndex, endIndex);
  }
    
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.fetchNews(); // ✅ Refetch news for the new page
    }
  }  

  private shuffleArray(array: INews[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
  }

  private getUniqueCategoryNews(newsArray: INews[]): INews[] {
    const uniqueNews: INews[] = [];
    const seenCategories = new Set<string>();

    for (const news of newsArray) {
      if (news.topic && !seenCategories.has(news.topic)) {
        uniqueNews.push(news);
        seenCategories.add(news.topic);
      }

      if (uniqueNews.length === 6) break;
    }

    return uniqueNews;
  }


  // Add category button
  onAddCategory(newsId: string, category: string): void {
    const key = `${this.userId}_${newsId}_${category}`;
  
    // Optimistic UI update
    this.categoryStates = { ...this.categoryStates, [key]: true };
    this.saveStateToLocalStorage();
  
    // ✅ Ensure UI updates
    this.cdr.markForCheck();
    this.cdr.detectChanges(); // 🔥 Force UI update
  
    this._CategoriesService.addCategory(category).subscribe({
      next: () => {
        console.log(`Category "${category}" added successfully for newsId ${newsId}`);
      },
      error: (err) => {
        console.error(`Error adding category "${category}":`, err);
        // Revert UI if request fails
        this.categoryStates = { ...this.categoryStates, [key]: false };
        this.saveStateToLocalStorage();
        this.cdr.markForCheck();
        this.cdr.detectChanges(); // 🔥 Ensure failure also updates UI
      }
    });
  }
  
  
  isCategorySaved(newsId: string, category: string): boolean {
    const key = `${this.userId}_${newsId}_${category}`;
    return this.categoryStates[key] || false;
  }
  

  private loadSavedCategories(): void {
    if (this.userId) {
      const savedData = localStorage.getItem(`categoryStates_${this.userId}`);
      if (savedData) {
        this.categoryStates = JSON.parse(savedData);
      }
    }
  }

  private saveStateToLocalStorage(): void {
    if (this.userId) {
      localStorage.setItem(`categoryStates_${this.userId}`, JSON.stringify(this.categoryStates));
      this.cdr.detectChanges();
    }
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
  
  

  // Load Bookmarks for the user
  loadBookmarks(): void {
    this._NewsService.getUserId().subscribe(user => {
      const userId = user.id;
      if (userId) {
        const savedBookmarks = localStorage.getItem(`bookmarkedNews_${userId}`);
        if (savedBookmarks) {
          this.bookmarkedNews = new Set(JSON.parse(savedBookmarks));
        }
      }
    });
  }

  // Save Bookmarks to localStorage
  saveBookmarks(): void {
    this._NewsService.getUserId().subscribe(user => {
      const userId = user.id;
      if (userId) {
        localStorage.setItem(`bookmarkedNews_${userId}`, JSON.stringify([...this.bookmarkedNews]));
      }
    });
  }

  // Toggle Bookmark
  toggleBookmark(newsId: string , event: Event): void {
    event.stopPropagation();
    const isBookmarked = this.bookmarkedNews.has(newsId);

    if (isBookmarked) {
      this._NewsService.RemoveFromBookmarks(newsId).subscribe({
        next: () => {
          this.bookmarkedNews.delete(newsId); // Remove only the specific newsId
          this.saveBookmarks(); // Save after removal
          this.cdr.detectChanges(); // Force UI update
        },
        error: (err) => console.log('Error removing from bookmarks:', err),
      });
    } else {
      this._NewsService.AddToFavorites(newsId).subscribe({
        next: () => {
          this.bookmarkedNews.add(newsId); // Add specific newsId
          this.saveBookmarks(); // Save after adding
          this.cdr.detectChanges(); // Force UI update
        },
        error: (err) => console.log('Error adding to bookmarks:', err),
      });
    }
  }


  isBookmarked(newsId: string): boolean {
    return this.bookmarkedNews.has(newsId);
  }

  navigateToCategory(topic: string, event: Event): void {
    if (!(event.target as HTMLElement).closest('.btn')) {
      this.router.navigate(['/category', topic]);
    }
  }


}
