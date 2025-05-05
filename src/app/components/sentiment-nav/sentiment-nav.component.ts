import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavBlankComponent } from "../nav-blank/nav-blank.component";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-sentiment-nav',
    imports: [RouterLink, CommonModule],
    templateUrl: './sentiment-nav.component.html',
    styleUrl: './sentiment-nav.component.scss'
})
export class SentimentNavComponent {
    type: string | null = null;
    sentimentNews$: Observable<any> | null = null;

    constructor(
        private route: ActivatedRoute, 
        private router: Router, 
        private cdr: ChangeDetectorRef, // Inject ChangeDetectorRef
        private http: HttpClient
    ) {}


    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.type = params['type'] || null;
            this.fetchSentimentNews(this.type); // Fetch on load
            this.cdr.detectChanges(); // Force UI update
        });
    }

    toggleSentiment(sentiment: 'positive' | 'negative'): void {
        const newType = this.type === sentiment ? null : sentiment;
        this.router.navigate([], {
            queryParams: { type: newType },
            queryParamsHandling: 'merge',
        });
        this.type = newType;
        this.fetchSentimentNews(newType);
        this.cdr.detectChanges(); // Force UI update
    }

    fetchSentimentNews(sentiment: string | null): void {
        const apiUrl = sentiment 
          ? `https://localhost:7291/api/sentiment-news/${sentiment}` 
          : `https://localhost:7291/api/sentiment-news/positive`;
    
        this.sentimentNews$ = this.http.get(apiUrl);
      }
    getNegativeText(): string {
        this.fetchSentimentNews("negative");
        return this.type === 'negative' ? 'All News' : 'Negative News';
        
    }

    getPositiveText(): string {
        return this.type === 'positive' ? 'All News' : 'Positive News';
    }

    getNegativeImage(): string {
        return this.type === 'negative' ? 'assets/images/Group 8.png' : 'assets/images/Group 6.png';
    }
    
    getPositiveImage(): string {
        return this.type === 'positive' ? 'assets/images/Group 8.png' : 'assets/images/Group 7.png';
    }
    
    
}
