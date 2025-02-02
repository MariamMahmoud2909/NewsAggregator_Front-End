import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../core/servcies/admin.service';
import { Icomment } from '../../core/interfaces/icomment';
import { Iaccount } from '../../core/interfaces/iaccount';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent implements OnInit{
  private readonly _AdminService = inject(AdminService);

    commentsList: Icomment[] = [];
    usersList: Iaccount[] = [];
    commentCount: number = 0;

  ngOnInit(): void {
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

  getCommentCount(): void {
    this._AdminService.getCommentCount().subscribe(count => {
      this.commentCount = count;
    });
}

  deleteComment(commentId: number): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      this._AdminService.deleteComment(commentId.toString()).subscribe({
        next: () => {
          alert('Comment deleted successfully!');
          this.getCommentCount();
          this.commentsList = this.commentsList.filter(comment => comment.id !== commentId);
        },
        error: (err) => {
          console.error('Error deleting comment:', err);
          alert('Failed to delete comment');
        }
      });
    }
  }

  lockUser(userId: string): void {
    this._AdminService.lockUser(userId).subscribe({
      next: () => {
        alert('User locked successfully!');
        this.usersList = this.usersList.map(user =>
          user.id === userId ? { ...user, isLockedOut: true } : user
        );
      },
      error: (err) => {
        console.error('Error locking user:', err);
        alert('Failed to lock user');
      }
    });
  }

  unlockUser(userId: string): void {
    this._AdminService.unlockUser(userId).subscribe({
      next: () => {
        alert('User unlocked successfully!');
        this.usersList = this.usersList.map(user =>
          user.id === userId ? { ...user, isLockedOut:false} : user
        );
      },
      error: (err) => {
        console.error('Error unlocking user:', err);
        alert('Failed to unlock user');
      }
    });
  }


}
