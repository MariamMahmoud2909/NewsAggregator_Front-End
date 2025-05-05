import { ChangeDetectorRef, Component, HostListener, inject, OnInit } from '@angular/core';
import { ArticleService } from '../../core/servcies/article.service';
import { CommonModule, NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IArticle } from '../../core/interfaces/iarticle';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ICommentsForSpecificArticle } from '../../core/interfaces/icomments-for-specific-article';
import { UserServiceService } from '../../core/servcies/user-service.service';
import { AdminService } from '../../core/servcies/admin.service';
import { ToastrService } from 'ngx-toastr';
import { INews } from '../../core/interfaces/inews';
import { NewsService } from '../../core/servcies/news.service';
import { CommentPopUpComponent } from '../comment-pop-up/comment-pop-up.component';
import { TranslationService } from '../../core/servcies/translation.service';
import { SpeechService } from '../../core/servcies/speech.service';
import { Router } from 'express';

@Component({
    selector: 'app-article',
    imports: [ReactiveFormsModule, NgIf,CommonModule,CommentPopUpComponent,FormsModule,RouterLink],
    templateUrl: './article.component.html',
    styleUrl: './article.component.scss'
})
export class ArticleComponent implements OnInit {

  private readonly _ToastrService=inject(ToastrService);
  private readonly _ArticleService=inject(ArticleService);
  private readonly _AdminService=inject(AdminService);
  private readonly _UserServiceService=inject(UserServiceService);
  private readonly _ActivatedRoute=inject(ActivatedRoute);
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _NewsService = inject(NewsService);
  private readonly _TranslationService = inject(TranslationService);
  private readonly _SpeechService = inject(SpeechService);

  public moreNews: INews[] = [];
  bookmarkedNews: Set<string> = new Set<string>();
  favoriteStates: { [key: string]: boolean } = {};
  private cdr: ChangeDetectorRef;
  selectedArticleId: string | null = null;
  showPopup: boolean = false;
  displayedNews: INews[] = [];
  allNews: INews[] = []; // ✅ Stores all news
  filteredNews: INews[] = [];
  likeCounts: { [key: string]: number } = {};   
  summarizedText: string = ''; 
  article: any;
  translatedSummary: string = '';
  translatedTitle: string = '';
  selectedLanguage: string = 'en';
  selectedLanguageSpeech: string = 'English';

  Searcharticle!: INews;

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

  commentForm:FormGroup = this._FormBuilder.group({
      content:[null]
    })

  editCommentForm:FormGroup = this._FormBuilder.group({
      content:[null]
    })


    editCommentId: number | null = null;


  surveyForm:FormGroup = this._FormBuilder.group({
    SourceDiscovery:[null],
    VisitFrequency:[null],
    IsLoadingSpeedSatisfactory:[null],
    NavigationEaseRating:[null]
  })

  shareForm:FormGroup = this._FormBuilder.group({
    platform:[null],
  })


  constructor(private route: ActivatedRoute, private http: HttpClient , cdr: ChangeDetectorRef) {this.cdr = cdr;}
  articlesLists: IArticle [] = [];
  commentsForSpecificArticleLists: ICommentsForSpecificArticle [] = [];
  userId: string = '';
  showShareOptions: boolean = false;

  currentPage: number = 1;
  pageSize: number = 50;
  totalPages: number = 3;
  totalPagesArray: number[] = [];

  ngOnInit(): void {

    this._UserServiceService.getUserInfo().subscribe({
      next: (res) => {
        console.log(res);
        this.userId = res.id;
      },
      error: (err) => {
        console.log(err);
      }
    });

    const articleId = this.route.snapshot.paramMap.get('id'); // Get ID from URL

    if (articleId) {
      this._NewsService.getAllNews(1, 100).subscribe((newsList: INews[]) => {
        this.article = newsList.find(news => news._Id === articleId)!; // Find the article
      });
    }

    this._ActivatedRoute.paramMap.subscribe({
      next:(p)=>{
        console.log(p);
        let articleId = p.get('id');
        this._ArticleService.getArticlebyId(articleId).subscribe({
          next:(res)=>{
            console.log(res);
            this.articlesLists = res ? [res] : [];
            console.log(this.articlesLists);

          },
          error:(err)=>{
            console.log(err);
          }
        })
      },
      error:(err)=>{
        console.log(err);
      }
    })

    this.getcomments();

    this._NewsService.bookmarkChange$.subscribe(newsId => {
      if (newsId) {
        if (this.bookmarkedNews.has(newsId)) {
          this.bookmarkedNews.delete(newsId);
          this.saveBookmarks(); // Save after deletion
          this.cdr.detectChanges(); // Force UI update
        }
      }
    });
    this.fetchNews()
    
  }
  summarizeArticle() {
    const apiUrl = `https://localhost:7291/api/Summarization/summarize`; 

    if (!this.article || !this.article.summary) {
      console.error('No article found to summarize');
      return;
    }
    else console.log('Sending text for summarization:', this.article.summary);


    const requestBody = {
      text: this.article.summary
    };

    this.http.post(apiUrl, requestBody).subscribe(
      (response: any) => {
        if (response && response.summary) {
        this.summarizedText = response.summary;
      } else {
        console.warn('Unexpected response:', response);
      }
    },
    (error) => {
      console.error('Summarization failed:', error);
    }
  );
}  
  fetchNews() : void
  {
    this._NewsService.getAllNews(this.currentPage, this.pageSize).subscribe({
      next:(res)=>{
        console.log(res);
        // this.shuffleArray(res);
        this.allNews = res; // ✅ Store all fetched news
        this.filteredNews = res;
        this.moreNews = res

        this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  
        this.updateDisplayedNews();

        this.loadBookmarks();

        const savedBookmarks = localStorage.getItem('bookmarkedNews');
        if (savedBookmarks) {
          this.bookmarkedNews = new Set(JSON.parse(savedBookmarks));
        } else {
          this.bookmarkedNews = new Set();
        }

        const savedLikes = localStorage.getItem('likeCounts');
        if (savedLikes) {
          this.likeCounts = JSON.parse(savedLikes);
        }

        this._NewsService.getUserId().subscribe(user => {
          this.userId = user.id;
          const savedFavorites = localStorage.getItem(`favoriteStates_${this.userId}`);
          if (savedFavorites) {
            this.favoriteStates = JSON.parse(savedFavorites);
          }
        });
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }


  // translateArticle(): void {
  //   this._TranslationService.translate(this.article.title , this.selectedLanguage)
  //   .subscribe({
  //     next: (res) => {
  //       console.log("Title Translation Response:", res);
  //       this.translatedTitle = res.translation.innerResult.translation;
  //       this.cdr.detectChanges();
  //     },
  //     error: () => {
  //       this.translatedTitle = "Translation failed";
  //     }
  //   });

  //   this._TranslationService.translate(this.article.summary, this.selectedLanguage)
  //     .subscribe({
  //       next:(res)=>{
  //         this.translatedSummary = res.translation.innerResult.translation;
  //       },
  //       error:()=>{
  //         this.translatedSummary = "Translation failed";
  //       }
  //     })
  // }

  translateArticle(): void {
    this._TranslationService.translate(this.article.title, this.selectedLanguage)
      .subscribe({
        next: (res) => {
          console.log("Title Translation Response:", res);
          this.translatedTitle = res.translation; // <- FIXED
          this.cdr.detectChanges();
        },
        error: () => {
          this.translatedTitle = "Translation failed";
        }
      });
  
    this._TranslationService.translate(this.article.summary, this.selectedLanguage)
      .subscribe({
        next: (res) => {
          this.translatedSummary = res.translation; 
        },
        error: () => {
          this.translatedSummary = "Translation failed";
        }
      });
  }
  selectLanguage(lang: string, label: string): void {
    this.selectedLanguage = lang;
    this.selectedLanguageSpeech = label;
    this.translateArticle(); 
  }

  isPlaying: boolean = false;
  isAudioPlaying: boolean = false;
  audio: HTMLAudioElement | null = null;
  currentTime: number = 0;
  duration: number = 0;
  
  playTextToSpeech(text: string, language: string) {
    this._SpeechService.textToSpeech(text, language).subscribe({
      next: (audioBlob) => {
        const audioUrl = URL.createObjectURL(audioBlob);
        this.audio = new Audio(audioUrl);
  
        this.audio.onloadedmetadata = () => {
          this.duration = this.audio!.duration;
        };
  
        this.audio.ontimeupdate = () => {
          this.currentTime = this.audio!.currentTime;
        };
  
        this.audio.onended = () => {
          this.isPlaying = false;
          this.isAudioPlaying = false;
          this.currentTime = 0;
        };
  
        this.audio.play();
        this.isPlaying = true;
        this.isAudioPlaying = true;
      },
      error: (err) => {
        console.error('Error fetching speech audio:', err);
      }
    });
  }
  
  pauseAudio() {
    if (this.audio) {
      this.audio.pause();
      this.isAudioPlaying = false;
    }
  }
  
  resumeAudio() {
    if (this.audio) {
      this.audio.play();
      this.isAudioPlaying = true;
    }
  }
  
  seekAudio(event: Event) {
    const input = event.target as HTMLInputElement;
    if (this.audio) {
      this.audio.currentTime = +input.value;
    }
  }
  
  stopAudio() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.isPlaying = false;
    this.isAudioPlaying = false;
    this.currentTime = 0;
  }
  
  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
  



  applySearchFilter(query: string): void {
    if (query) {
      this.filteredNews = this.allNews.filter(news =>
        news.title.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      this.filteredNews = [...this.allNews];
    }
    this.currentPage = 1;
    this.updateDisplayedNews();
  }

  updateDisplayedNews(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedNews = this.moreNews.slice(startIndex, endIndex);
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

  getcomments():void{
    this._ActivatedRoute.paramMap.subscribe({
      next:(p)=>{
        console.log(p);
        let articleId = p.get('id');
        this._ArticleService.getCommentsForSpecificArticle(articleId).subscribe({
          next:(res)=>{
            console.log('getCommentsForSpecificArticle', res);
            this.commentsForSpecificArticleLists = res;
            console.log(this.commentsForSpecificArticleLists);
          },
          error:(err)=>{
            console.log(err);
          }
        })
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

  selectPlatform(platform: string): void {
    this.shareForm.patchValue({ platform });
    console.log('Selected platform:', platform);
    this.shareArticle(); // Automatically share the article after selecting the platform
  }

  shareArticle(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (params) => {
        let articleId = params.get('id');
        if (articleId) {
          this._ArticleService.shareArticle(this.shareForm.value, articleId).subscribe({
            next: (res) => {
              console.log('Article shared successfully:', res);
              this.showShareOptions = false; // Hide the share options after successful sharing
              const platform = this.shareForm.value.platform;
              const shareLink = res.shareLinks[platform];
              if(shareLink){
                window.open(shareLink, '_blank');
              }
            },
            error: (err) => {
              console.log('Share error:', err);
            }
          });
        }
      },
      error: (err) => {
        console.log('Route params error:', err);
      }
    });
  }



  downloadArticle(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (params) => {
        let articleId = params.get('id');
        if (articleId) {
          this._ArticleService.downloadArticle(articleId).subscribe({
            next: (res) => {
              const blob = new Blob([res], { type: 'application/pdf' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `article_${articleId}.pdf`; // Name of the downloaded file
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
            },
            error: (err) => {
              console.log('Download error:', err);
            }
          });
        }
      },
      error: (err) => {
        console.log('Route params error:', err);
      }
    });
  }


  toggleShare(event: MouseEvent): void {
    event.stopPropagation();  // Prevent the click from propagating to the document listener
    this.showShareOptions = !this.showShareOptions;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Check if the click happened outside the share button and options
    if (!target.closest('.position-relative')) {
      this.showShareOptions = false;
    }
  }


      commentSubmit():void
      {
        if(this.commentForm.valid)
        {
          this._ActivatedRoute.paramMap.subscribe({
            next:(p)=>{
              console.log(p);
              let articleId = p.get('id');
              this._ArticleService.setComment(this.commentForm.value, articleId).subscribe({
                next:(res)=>{
                  console.log(res);
                  this.commentForm.reset();
                  this._ToastrService.success(res.result, 'Success')
                  this.getcomments();
                },
                error:(err:HttpErrorResponse)=>{
                  console.log(err);
                },
              })
            },

            error:(err)=>{
              console.log(err);
            }
          })
        }
      }


      deleteComment(commentId: number): void {
        this._AdminService.deleteComment(commentId.toString()).subscribe({
          next: () => {
            this._ToastrService.success('Comment deleted successfully!', 'Success');
            this.getcomments();
          },
          error: (err) => {
            console.error('Error deleting comment:', err);
            this._ToastrService.error('Failed to delete comment', 'Failed')
          }
        });
      }

      startEditing(comment: any) {
        this.editCommentId = comment.id; // Store the comment ID
        this.editCommentForm.patchValue({ content: comment.content }); // Set the comment content in the input field
      }


      editcomment(commentId: number): void {
        this._AdminService.editComment(commentId.toString(), this.editCommentForm.value).subscribe({
        next: () => {
          this.editCommentId = null; // Hide the input field after editing
          this.getcomments();
        },
        error: (err) => {
          console.error('Error editing comment:', err);
        }
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
