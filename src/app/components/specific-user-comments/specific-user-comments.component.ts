import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../core/servcies/admin.service';
import { ActivatedRoute } from '@angular/router';
import { IUserComments } from '../../core/interfaces/iuser-comments';
import { NgClass } from '@angular/common';
import { Iaccount } from '../../core/interfaces/iaccount';

@Component({
  selector: 'app-specific-user-comments',
  standalone: true,
  imports: [NgClass],
  templateUrl: './specific-user-comments.component.html',
  styleUrl: './specific-user-comments.component.scss'
})
export class SpecificUserCommentsComponent implements OnInit{

  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _AdminService = inject(AdminService);

  specificUserCommentsList : IUserComments[] = [];
  idUser:any = '';
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


}
