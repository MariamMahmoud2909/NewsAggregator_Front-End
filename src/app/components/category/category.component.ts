import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { SentimentNavComponent } from "../sentiment-nav/sentiment-nav.component";
import { CategoriesService } from '../../core/servcies/categories.service';
import { INews } from '../../core/interfaces/inews';
import { NewsService } from '../../core/servcies/news.service';
import { ICategories } from '../../core/interfaces/icategories';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommentPopUpComponent } from "../comment-pop-up/comment-pop-up.component";

@Component({
    selector: 'app-category',
    imports: [SentimentNavComponent, CommonModule, RouterLink, CommentPopUpComponent],
    templateUrl: './category.component.html',
    styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit{
    private readonly _CategoriesService=inject(CategoriesService)
    private readonly _NewsService=inject(NewsService)
    private readonly _route = inject(ActivatedRoute);

    public articleCategory: INews[] = [];
    public Latest: INews[] = [];
    categories: ICategories = [];
    bookmarkedNews: Set<string> = new Set<string>();  // Ensuring only string IDs
    favoriteStates: { [key: string]: boolean } = {};
    private userId: string = ''
    private cdr: ChangeDetectorRef;
    public categoryName: string = '';
    displayedNews: INews[] = [];
    currentPage: number = 1;
  pageSize: number = 80;
  totalPages: number = 3;
  totalPagesArray: number[] = [];
  likeCounts: { [key: string]: number } = {};   


    constructor(cdr: ChangeDetectorRef) {
        this.cdr = cdr;
      }

    categoryMap: { [key: string]: string } = {
        stockmarketinformationandanalysis: 'Stock Market',
        newsandcareerportal: 'Career News',
        newsandmedia: 'Media News',
        tech: 'Technology',
        world: 'World News',
      };

      // Category Image Mapping
      imageMapping: { [key: string]: string } = {
        gaming: '../../../assets/images/gaming.jpg',
        news: '../../../assets/images/general.jpg',
        sport: '../../../assets/images/sports.jpg',
        tech: '../../../assets/images/technology.jpg',
        world: '../../../assets/images/world.png',
        finance: '../../../assets/images/finance.jpg',
        politics: '../../../assets/images/politics.jpg',
        business: '../../../assets/images/business.jpg',
        economics: '../../../assets/images/economics.jpg',
        entertainment: '../../../assets/images/entertainment.jpg',
        beauty: '../../../assets/images/beauty.jpg',
        travel: '../../../assets/images/travel.png',
        music: '../../../assets/images/music.png',
        food: '../../../assets/images/food.jpg',
        science: '../../../assets/images/science.jpg',
        energy: '../../../assets/images/energy.jpg',
        stockmarketinformationandanalysis: '../../../assets/images/stockmarketinformationandanalysis.png',
        newsandcareerportal: '../../../assets/images/newsandcareerportal.png',
        newsandmedia: '../../../assets/images/newsandmedia.png',
      };


      selectedArticleId: string | null = null;
      showPopup: boolean = false;

    openCommentPopup(articleId: string,event: Event) {
      event.stopPropagation();
      this.selectedArticleId = articleId;
      this.showPopup = true;
    }

    closeCommentPopup() {
      this.showPopup = false;
    }


    ngOnInit(): void {

        this._route.paramMap.subscribe(params => {
            const category = params.get('categoryName');
            if (category) {
                this.categoryName = category; // Store category name
                this._CategoriesService.getArticlesByCategory(this.categoryName).subscribe({
                    next: (res) => {
                        console.log(res);
                        this.articleCategory = res;
                        console.log(this.articleCategory);

                    },
                    error: (err) => {
                        console.log(err);
                    }
                });
            }
        });



        this._CategoriesService.getAllCategories().subscribe({
            next: (res) => {
                console.log(res);
                this.categories = res;
            },
            error: (err) => {
                console.log(err);
            }
        });

       this.fetch();
    }

    fetch():void{
       this._NewsService.getAllNews(this.currentPage, this.pageSize).subscribe({
            next: (res) => {
                console.log(res);
                this.shuffleArray(res);
                this.Latest = res;
            },
            error: (err) => {
                console.log(err);
            }
        })
        const savedLikes = localStorage.getItem('likeCounts');
        if (savedLikes) {
          this.likeCounts = JSON.parse(savedLikes);
        }
    }

    private getArticles(categoryName: string): void {
        this._CategoriesService.getArticlesByCategory(categoryName).subscribe({
            next: (res) => {
                console.log(res);
                this.articleCategory = res;
            },
            error: (err) => {
                console.log(err);
            }
        });
    }

    private shuffleArray(array: INews[]): void {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
      }


      getImageForCategory(categoryName: string): string {
        return this.imageMapping[categoryName];
      }

      getCategoryDisplayName(category: string): string {
        return this.categoryMap[category] || category; // Fallback to original category name
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
}
