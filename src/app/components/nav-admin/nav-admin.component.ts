import { Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/servcies/auth.service';
import { AdminService } from '../../core/servcies/admin.service';
import { Iaccount } from '../../core/interfaces/iaccount';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { IUserInfo } from '../../core/interfaces/iuser-info';
import { UserServiceService } from '../../core/servcies/user-service.service';
import { DarkModeService } from '../../core/servcies/dark-mode.service';

@Component({
    selector: 'app-nav-admin',
    imports: [RouterLink, RouterLinkActive, NgIf, NgFor,CommonModule],
    templateUrl: './nav-admin.component.html',
    styleUrl: './nav-admin.component.scss'
})
export class NavAdminComponent {

  private readonly _AuthService = inject(AuthService)
  private readonly _AdminService = inject(AdminService);
  private readonly _Router = inject(Router)
  private readonly _DarkModeService=inject(DarkModeService)

  name:string="";
  userCount: number = 0;
  commentCount: number = 0;
  usersList: Iaccount[] = [];
  filteredUsers: Iaccount[] = [];
    userInfo: IUserInfo[] = [];
  searchQuery: string = '';
  showSearchResults: boolean = false;
  isDarkMode = false;

  @ViewChild('searchContainer', { static: false }) searchContainer!: ElementRef;
    private readonly _UserServiceService = inject(UserServiceService);


  ngOnInit(): void {
    this.name=this._AuthService.userData.sub;
    this.loadCounts();
    this.getallusers();

    this._UserServiceService.getUserInfo().subscribe({
      next: (res) => {
        console.log(res);
        this.userInfo = [res];
      },
      error: (err) => {
        console.log(err);
      }
    });

  }



  loadCounts(): void {
    this._AdminService.getUserCount().subscribe(count => this.userCount = count);
    this._AdminService.getCommentCount().subscribe(count => this.commentCount = count);
  }


  getallusers():void{
    this._AdminService.getAllUsers().subscribe({
      next: (res) => {
        console.log(res);
        this.usersList = res;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  onSearch(event: Event): void {
    const input = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.searchQuery = input;
    this.filteredUsers = input
      ? this.usersList.filter(user => user.userName.toLowerCase().includes(input))
      : [];
    this.showSearchResults = this.filteredUsers.length > 0;
  }

  @HostListener('document:click')
onClickAnywhere(): void {
  this.showSearchResults = false;
}






  logout():void
    {
      localStorage.removeItem('userToken');
      this._Router.navigate(['/login']);
    }
    
    toggleDarkMode() {
      this._DarkModeService.toggleDarkMode();
      this.isDarkMode = !this.isDarkMode;
    }
}
