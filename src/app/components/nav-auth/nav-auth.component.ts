import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DarkModeService } from '../../core/servcies/dark-mode.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-nav-auth',
    imports: [RouterLink, RouterLinkActive ,CommonModule],
    templateUrl: './nav-auth.component.html',
    styleUrl: './nav-auth.component.scss'
})
export class NavAuthComponent {
    private readonly _DarkModeService=inject(DarkModeService)

    isDarkMode = false;

    toggleDarkMode() {
        this._DarkModeService.toggleDarkMode();
        this.isDarkMode = !this.isDarkMode;
      }
}
