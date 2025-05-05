import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../core/servcies/admin.service';
import { Icomment } from '../../core/interfaces/icomment';
import { Iaccount } from '../../core/interfaces/iaccount';
import { ToastrService } from 'ngx-toastr';
import { NgClass, NgStyle } from '@angular/common';

@Component({
    selector: 'app-comments',
    imports: [NgClass],
    templateUrl: './comments.component.html',
    styleUrl: './comments.component.scss'
})
export class CommentsComponent implements OnInit{

  private readonly _ToastrService = inject(ToastrService);
  private readonly _AdminService = inject(AdminService);

    commentsList: Icomment[] = [];
    usersList: Iaccount[] = [];
    commentCount: number = 0;

  ngOnInit(): void {
    this.getallcomments();
  }

  getCommentCount(): void {
    this._AdminService.getCommentCount().subscribe(count => {
      this.commentCount = count;
    });
}

  getallcomments():void{
    this._AdminService.getAllComments().subscribe({
      next: (res) => {
        console.log(res);
        this.commentsList = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  deleteComment(commentId: number): void {
    this._AdminService.deleteComment(commentId.toString()).subscribe({
      next: () => {
        this._ToastrService.success('Comment deleted successfully!', 'Success');
        this.getallcomments();
        this._AdminService.getCommentCount().subscribe(count => this.commentCount = count);
        this.commentsList = this.commentsList.filter(comment => comment.id !== commentId);
      },
      error: (err) => {
        console.error('Error deleting comment:', err);
        this._ToastrService.error('Failed to delete comment', 'Failed');
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
        this._ToastrService.success('User unlocked successfully!', 'Success');
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
