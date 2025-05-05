import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../core/servcies/admin.service';
import { ActivatedRoute } from '@angular/router';
import { IUserComments } from '../../core/interfaces/iuser-comments';
import { NgClass } from '@angular/common';
import { Iaccount } from '../../core/interfaces/iaccount';
import { Icomment } from '../../core/interfaces/icomment';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-specific-user-comments',
    imports: [NgClass],
    templateUrl: './specific-user-comments.component.html',
    styleUrl: './specific-user-comments.component.scss'
})
export class SpecificUserCommentsComponent implements OnInit{

  private readonly _ToastrService = inject(ToastrService);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _AdminService = inject(AdminService);

  specificUserCommentsList : IUserComments[] = [];
  idUser:any = '';
  commentsList: Icomment[] = [];
  usersList : Iaccount[] = []

  ngOnInit(): void {

    this._ActivatedRoute.paramMap.subscribe({
      next:(p)=>{
        // console.log(p.get('id'));
        let userId = p.get('id');
        this.idUser = p.get('id');
        this._AdminService.getSpecificUserComments(userId).subscribe({
          next:(res)=>{
            console.log(res);
            this.specificUserCommentsList = res;
          },
          error:(err)=>{
            console.log(err);
          }
        })
      }
    })

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


  deleteComment(commentId: number): void {
    this._AdminService.deleteComment(commentId.toString()).subscribe({
      next: () => {
        this._ToastrService.success('Comment deleted successfully!', 'Success')
        this.commentsList = this.commentsList.filter(comment => comment.id !== commentId);
      },
      error: (err) => {
        console.error('Error deleting comment:', err);
        this._ToastrService.error('Failed to delete comment', 'Failed')
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
        this._ToastrService.error('Failed to lock user', 'Failed');
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
        this._ToastrService.error('Failed to unlock user', 'Failed');
      }
    });
  }

}
