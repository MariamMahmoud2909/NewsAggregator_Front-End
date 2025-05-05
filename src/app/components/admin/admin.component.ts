import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../core/servcies/admin.service';
import { Iaccount } from '../../core/interfaces/iaccount';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-admin',
    imports: [NgClass, RouterLink],
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {

  private readonly _ToastrService = inject(ToastrService);
  private readonly _AdminService = inject(AdminService);
  usersList: Iaccount[] = [];

  ngOnInit(): void {
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


  lockUser(userId: string): void {
    this._AdminService.lockUser(userId).subscribe({
      next: () => {
        this._ToastrService.success('User locked successfully!', 'Success')
        this.usersList = this.usersList.map(user =>
          user.id === userId ? { ...user, isLockedOut: true } : user
        );
      },
      error: (err) => {
        console.error('Error locking user:', err);
        this._ToastrService.error('Failed to lock user', 'Failed')
      }
    });
  }

  unlockUser(userId: string): void {
    this._AdminService.unlockUser(userId).subscribe({
      next: () => {
        this._ToastrService.success('User unlocked successfully!', 'Success')
        this.usersList = this.usersList.map(user =>
          user.id === userId ? { ...user, isLockedOut:false} : user
        );
      },
      error: (err) => {
        console.error('Error unlocking user:', err);
        this._ToastrService.error('Failed to unlock user', 'Failed')
      }
    });
  }



}
