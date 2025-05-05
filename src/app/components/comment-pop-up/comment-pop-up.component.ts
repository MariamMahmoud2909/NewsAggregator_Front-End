import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Icomment } from '../../core/interfaces/icomment';
import { ArticleService } from '../../core/servcies/article.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminService } from '../../core/servcies/admin.service';
import { UserServiceService } from '../../core/servcies/user-service.service';

@Component({
  selector: 'app-comment-pop-up',
  imports: [NgIf, NgFor, ReactiveFormsModule],
  templateUrl: './comment-pop-up.component.html',
  styleUrl: './comment-pop-up.component.scss'
})
export class CommentPopUpComponent implements OnChanges {

  private readonly _ArticleService = inject(ArticleService);
  private readonly _UserServiceService = inject(UserServiceService);
  private readonly _AdminService = inject(AdminService);
    private readonly _FormBuilder = inject(FormBuilder);


  @Input() showComments: boolean = false;
  @Input() articleId: string | null = null;

  @Output() closePopup = new EventEmitter<void>();

  editCommentId: number | null = null;
  userId: string = '';
  comments: Icomment[] = [];

  commentForm:FormGroup = this._FormBuilder.group({
        content:[null]
      })

    editCommentForm:FormGroup = this._FormBuilder.group({
        content:[null]
      })

      ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.getUserInfo();
        this.getComments();
      }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['articleId'] && this.articleId) {
      this.getComments();
    }
  }

  getUserInfo():void{
    this._UserServiceService.getUserInfo().subscribe({
      next: (res) => {
        console.log(res);
        this.userId = res.id;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getComments(): void {
    if (!this.articleId) return;
    this._ArticleService.getCommentsForSpecificArticle(this.articleId).subscribe({
      next: (res) => {
        console.log('Comments for article:', this.articleId, res);
        this.comments = res;
      },
      error: (err) => {
        console.log('error from getcomment',err);
      }
    });
  }

  commentSubmit():void
        {
          if(this.commentForm.valid)
          {
            this._ArticleService.setComment(this.commentForm.value, this.articleId).subscribe({
              next:(res)=>{
                console.log(res);
                this.commentForm.reset();
                // this._ToastrService.success(res.result, 'Success')
                this.getComments();
              },
              error:(err:HttpErrorResponse)=>{
                console.log(err);
              },
            })

          }
        }

        // deleteComment(commentId: number): void {
        //   this._AdminService.deleteComment(commentId.toString()).subscribe({
        //     next: () => {
        //       this.getComments();
        //     },
        //     error: (err) => {
        //       console.error('Error deleting comment:', err);
        //     }
        //   });
        // }

        deleteComment(commentId: number): void {
          this._AdminService.deleteComment(commentId.toString()).subscribe({
            next: () => {
              // this._ToastrService.success('Comment deleted successfully!', 'Success');
              this.getComments();
            },
            error: (err) => {
              console.error('Error deleting comment:', err);
              // this._ToastrService.error('Failed to delete comment', 'Failed')
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
            this.getComments();
          },
          error: (err) => {
            console.error('Error editing comment:', err);
          }
        });
      }

      closeComments(event: Event) {
        event.stopPropagation();
        this.closePopup.emit();
        this.comments= [];
      }


}
