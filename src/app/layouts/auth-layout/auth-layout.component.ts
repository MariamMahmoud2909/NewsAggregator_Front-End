import { Component } from '@angular/core';
import { NavAuthComponent } from "../../components/nav-auth/nav-auth.component";
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "../../components/footer/footer.component";
import { SentimentNavComponent } from "../../components/sentiment-nav/sentiment-nav.component";

@Component({
    selector: 'app-auth-layout',
    imports: [NavAuthComponent, RouterOutlet, FooterComponent, SentimentNavComponent],
    templateUrl: './auth-layout.component.html',
    styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent {

}
