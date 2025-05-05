import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {

  private darkModeKey = 'dark-mode';

  constructor() {
    const isDarkMode = localStorage.getItem(this.darkModeKey) === 'true';
    this.setDarkMode(isDarkMode);
  }

  toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem(this.darkModeKey, JSON.stringify(isDarkMode));
  }

  setDarkMode(isDark: boolean) {
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}
