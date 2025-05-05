import { Component, EventEmitter, inject, Output } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SentimentNavComponent } from "../sentiment-nav/sentiment-nav.component";
import { AuthService } from '../../core/servcies/auth.service';
import { IUserInfo } from '../../core/interfaces/iuser-info';
import { NotificationsService } from '../../core/servcies/notifications.service';
import { INotifications } from '../../core/interfaces/INotifications';
import { CommonModule, NgIf } from '@angular/common';
import { UserServiceService } from '../../core/servcies/user-service.service';
import { DarkModeService } from '../../core/servcies/dark-mode.service';
import { NewsService } from '../../core/servcies/news.service';
import { FormsModule } from '@angular/forms';
import { ICategories } from '../../core/interfaces/icategories';
import { INews } from '../../core/interfaces/inews';
import { CategoriesService } from '../../core/servcies/categories.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-nav-blank',
    imports: [RouterLink, RouterLinkActive, NgIf,CommonModule,FormsModule],
    templateUrl: './nav-blank.component.html',
    styleUrl: './nav-blank.component.scss'
})
export class NavBlankComponent {

  private readonly _AuthService = inject(AuthService);
  private readonly _NotificationsService = inject(NotificationsService);
      private readonly _UserServiceService = inject(UserServiceService);
      private readonly _DarkModeService=inject(DarkModeService)
      private readonly _NewsService = inject(NewsService)
      private readonly _CategoriesService = inject(CategoriesService)
      private readonly _ToastrService = inject(ToastrService);

  private readonly _Router = inject(Router);

  userInfo: IUserInfo[] = [];
  notifications: INotifications[] = [];
  name:string="";
  length:number=0;
  isDarkMode = false; 
  notificationCount: number = 0;

  selectedCategoriesCount: number = 0;
  private categorySubscription!: Subscription;
  
  ngOnInit(): void {
    // Check if the account was reactivated
    const accountReactivated = localStorage.getItem('accountReactivated');
    if (accountReactivated === 'true') {
      // Show a prominent message
      this._ToastrService.success('Your account is active again! You can now use all features of the application.', 'Account Reactivated', {
        timeOut: 10000,
        closeButton: true,
        progressBar: true,
        positionClass: 'toast-top-center',
        enableHtml: true
      });
      
      // Clear the flag after showing the message
      localStorage.removeItem('accountReactivated');
    }
    
    // Check if the user is deactivated
    const isDeactivated = localStorage.getItem('isDeactivated');
    if (isDeactivated === 'true') {
      this._ToastrService.error('Your account has been deactivated. Please contact support for assistance.', 'Account Deactivated');
      this.logout();
      return;
    }
    
    this._UserServiceService.getUserInfo().subscribe({
      next: (res) => {
        console.log(res);
        this.userInfo = [res];

        const userId = res.id;
        this.loadSelectedCategoriesCount(userId);
      },
      error: (err) => {
        console.log(err);
      }
    });
  
    this.getnotifications();
  
    // Properly subscribe and store the subscription
    this.categorySubscription = this._CategoriesService.selectedCategoriesCount$.subscribe(count => {
      console.log("Updated count in nav-blank:", count);
      this.selectedCategoriesCount = count;
    });
  }

  loadSelectedCategoriesCount(userId: string): void {
    const savedCount = localStorage.getItem(`selectedCategories_${userId}`);
    const count = savedCount ? JSON.parse(savedCount) : 0;
  
    console.log(`Loading selected categories count for user ${userId}:`, count);
  
    //  Update the service with the correct count
    this._CategoriesService.updateSelectedCategoriesCount(count);
  }

  goHome(event: Event): void {
    console.log('Checking before navigation - Selected categories count:', this.selectedCategoriesCount);
    
    if (this.selectedCategoriesCount < 3) {
      event.preventDefault();
      return;
    }

    this.router.navigate(['/home']);
  }
  
  // Unsubscribe to prevent memory leaks
  ngOnDestroy(): void {
    if (this.categorySubscription) {
      this.categorySubscription.unsubscribe();
    }
  }

  getnotifications():void{
    this._NotificationsService.getNotifications().subscribe({
    next: (res) => {
      this.notifications = res || [];
      this.notificationCount = this.notifications.length; // Set initial count
    },
    error: (err) => {
      console.error(err);
      this.notifications = [];
      this.notificationCount = 0;
    }
  });

    this._Router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url === '/home') {
        this.clearSearch();
      }
    });
  }

  markNotificationsAsRead(): void {
    this.notificationCount = 0;
  }
  


  logout():void
    {
      localStorage.removeItem('userToken');
      this._Router.navigate(['/login']);
    }


    

  // logout():void
  //   {
  //     this._AuthService.logout(this.name);
  //   }

  toggleDarkMode() {
    this._DarkModeService.toggleDarkMode();
    this.isDarkMode = !this.isDarkMode;
  }
  searchQuery: string = '';
  filteredNews: INews[] = [];
  showSearchResults: boolean = false;

  constructor(private router: Router, private http: HttpClient) {}

  // filterNews(): void {
  //   if (this.searchQuery.trim()) {
  //     this._NewsService.getAllNews(1, 100).subscribe((newsList: INews[]) => {
  //       this.filteredNews = newsList.filter(news =>
  //         news.title.slice(0,35).toLowerCase().includes(this.searchQuery.toLowerCase()) ||
  //         news.summary.slice(0,35).toLowerCase().includes(this.searchQuery.toLowerCase()) 
  //       );
  //       this.showSearchResults = this.filteredNews.length > 0;
  //     });
  //   } else {
  //     this.filteredNews = [];
  //     this.showSearchResults = false;
  //   }
  // }
  private debounceTimer: any = null;

  searchArticles(query: string) {
    const url = 'https://localhost:7291/api/Search/searchResults';
    const body = {
      query: query,
      page: 1
    };
  
    this.http.post<any>(url, body).subscribe({
      next: (res) => {
        this.filteredNews = res.results;
        this.showSearchResults = true;
      },
      error: (err) => {
        console.error('Search error:', err);
        this.filteredNews = [];
        this.showSearchResults = false;
      }
    });
  }
  
  filterNews() {
  clearTimeout(this.debounceTimer); 
  const trimmedQuery = this.searchQuery.trim();

  if (trimmedQuery) {
    this.debounceTimer = setTimeout(() => {
      this.searchArticles(trimmedQuery);
    }, 800);
  } else {
    this.filteredNews = [];
    this.showSearchResults = false;
  }
}

  selectNews(news: INews): void {
    console.log('Selected News ID:', news._Id);
    this.searchQuery = news.title; // Show selected title in the search bar
    this.showSearchResults = false; // Hide search results
    this.router.navigate(['/article', news._Id]); // Navigate to article page
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filteredNews = [];
    this.showSearchResults = false;
  }
}
