import { routes } from './../../app.routes';
import { Component } from '@angular/core';
import { NavBlankComponent } from "../../components/nav-blank/nav-blank.component";
import { Route, Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from "../../components/footer/footer.component";
import { SentimentNavComponent } from "../../components/sentiment-nav/sentiment-nav.component";

@Component({
    selector: 'app-blank-layout',
    imports: [NavBlankComponent, RouterOutlet, FooterComponent],
    templateUrl: './blank-layout.component.html',
    styleUrl: './blank-layout.component.scss'
})
export class BlankLayoutComponent {
    constructor(private router: Router){}
}
