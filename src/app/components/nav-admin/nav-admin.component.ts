import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/servcies/auth.service';
import { AdminService } from '../../core/servcies/admin.service';
import { Iaccount } from '../../core/interfaces/iaccount';
import { Icomment } from '../../core/interfaces/icomment';

@Component({
  selector: 'app-nav-admin',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-admin.component.html',
  styleUrl: './nav-admin.component.scss'
})
export class NavAdminComponent {

  private readonly _AuthService = inject(AuthService)
  private readonly _AdminService = inject(AdminService);
  private readonly _Router = inject(Router)

  name:string="";
  userCount: number = 0;
  commentCount: number = 0;

  ngOnInit(): void {
    this.name=this._AuthService.userData.sub;
    this.loadCounts();
  }



  loadCounts(): void {
    this._AdminService.getUserCount().subscribe(count => this.userCount = count);
    this._AdminService.getCommentCount().subscribe(count => this.commentCount = count);
  }


  logout():void
    {
      localStorage.removeItem('userToken');
      this._Router.navigate(['/login']);
    }


}
