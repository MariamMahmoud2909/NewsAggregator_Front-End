import { Component, inject, OnInit } from '@angular/core';
import { CategoriesService } from '../../core/servcies/categories.service';
import { ICategories } from '../../core/interfaces/icategories';
import { NgIf, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { NewsService } from '../../core/servcies/news.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [NgIf, NgFor], // Ensure NgFor is included
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  private readonly _CategoriesService = inject(CategoriesService);
  private readonly _NewsService = inject(NewsService);
  categories: ICategories = [];
  categoryStates: { [key: string]: boolean } = {}; // Tracks added categories

  // Category Name Mapping
  categoryMap: { [key: string]: string } = {
    stockmarketinformationandanalysis: 'Stock Market',
    newsandcareerportal: 'Career News',
    newsandmedia: 'Media News',
    tech: 'Technology',
    world: 'World News',
  };

  // Category Image Mapping
  imageMapping: { [key: string]: string } = {
    gaming: '../../../assets/images/gaming.jpg',
    news: '../../../assets/images/general.jpg',
    sport: '../../../assets/images/sports.jpg',
    tech: '../../../assets/images/technology.jpg',
    world: '../../../assets/images/world.png',
    finance: '../../../assets/images/finance.jpg',
    politics: '../../../assets/images/politics.jpg',
    business: '../../../assets/images/business.jpg',
    economics: '../../../assets/images/economics.jpg',
    entertainment: '../../../assets/images/entertainment.jpg',
    beauty: '../../../assets/images/beauty.jpg',
    travel: '../../../assets/images/travel.png',
    music: '../../../assets/images/music.png',
    food: '../../../assets/images/food.jpg',
    science: '../../../assets/images/science.jpg',
    energy: '../../../assets/images/energy.jpg',
    stockmarketinformationandanalysis: '../../../assets/images/stockmarketinformationandanalysis.png',
    newsandcareerportal: '../../../assets/images/newsandcareerportal.png',
    newsandmedia: '../../../assets/images/newsandmedia.png',
  };

  ngOnInit(): void {
    this._CategoriesService.getAllCategories().subscribe({
      next: (res: ICategories) => {
        this.categories = res;
        console.log(this.categories); // Debugging
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      },
    });

    this._NewsService.getUserId().subscribe({
      next: (user) => {
        const userId = user.id;
        if (userId) {
          const savedCategories = localStorage.getItem(`selectedCategories_${userId}`);
          if (savedCategories) {
            this.categoryStates = JSON.parse(savedCategories);
          }
        }
      },
      error: (err) => console.log('Error fetching user ID:', err),
    });
  }

  getImageForCategory(categoryName: string): string {
    return this.imageMapping[categoryName] || '../../../assets/images/default.jpg';
  }

  getCategoryDisplayName(category: string): string {
    return this.categoryMap[category] || category; // Fallback to original category name
  }

  constructor(private router: Router) {}

  selectedCategoriesCount = 0;
  addCategory(cat_name: string): void {
    this._NewsService.getUserId().subscribe({
      next: (user) => {
        const userId = user.id;
        if (userId) {
          this._CategoriesService.addCategory(cat_name).subscribe({
            next: (res) => {
              console.log(res);
              if (!this.categoryStates[cat_name]) {
                this.categoryStates = { ...this.categoryStates, [cat_name]: true };
                this.selectedCategoriesCount++; 
                this._CategoriesService.updateSelectedCategoriesCount(this.selectedCategoriesCount);
                
                // Save categories in localStorage per user
                this.saveSelectedCategories(userId);
              }
            },
            error: (err) => {
              console.log(err);
              this.categoryStates = { ...this.categoryStates, [cat_name]: false };
            },
          });
        }
      },
      error: (err) => console.log('Error fetching user ID:', err),
    });
  }
  

  saveSelectedCategories(userId: string): void {
    localStorage.setItem(`selectedCategories_${userId}`, JSON.stringify(this.categoryStates));
  }
  
  
  
  
  
// Navigate home when the user clicks the button
goHome(): void {
  this.router.navigate(['/home']);
}
  

}
