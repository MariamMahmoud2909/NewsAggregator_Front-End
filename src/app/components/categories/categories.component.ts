import { Component, inject, OnInit } from '@angular/core';
import { CategoriesService } from '../../core/servcies/categories.service';
import { ICategories } from '../../core/interfaces/icategories';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [NgIf],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  private readonly _CategoriesService = inject(CategoriesService);
  categories: ICategories = [];
  categoryStates: { [key: string]: boolean } = {}; // Tracks if a category is added
  imageMapping: { [key: string]: string } = {
    general: '../../../assets/images/general.jpg',
    business: '../../../assets/images/business.jpg',
    technology: '../../../assets/images/technology.jpg',
    sports: '../../../assets/images/sports.jpg',
    entertainment: '../../../assets/images/entertainment.jpg',
    health: '../../../assets/images/health.jpg',
    science: '../../../assets/images/science.jpg',
  };

  ngOnInit(): void {
    this._CategoriesService.getAllCategories().subscribe({
      next: (res: ICategories) => {
        this.categories = res;
        console.log(this.categories); // Logs the array of categories
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      },
    });
  }

  getImageForCategory(categoryName: string): string {
    return this.imageMapping[categoryName] || './assets/images/default.png'; // Return default image if not found
  }

  addcategory(cat_name: string): void {
    this._CategoriesService.addCategory(cat_name).subscribe({
      next: (res) => {
        console.log(res);
        this.categoryStates[cat_name] = true; // Mark this category as added
      },
      error: (err) => {
        console.log(err);
        this.categoryStates[cat_name] = false; // Optionally reset the state if there's an error
      },
    });
  }
}
