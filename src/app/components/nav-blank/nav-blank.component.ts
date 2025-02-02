import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SentimentNavComponent } from "../sentiment-nav/sentiment-nav.component";
import { AuthService } from '../../core/servcies/auth.service';

@Component({
  selector: 'app-nav-blank',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-blank.component.html',
  styleUrl: './nav-blank.component.scss'
})
export class NavBlankComponent {

  private readonly _AuthService = inject(AuthService);
  private readonly _Router = inject(Router);


  name:string="";

  ngOnInit(): void {
    this.name=this._AuthService.userData.sub;
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
}
