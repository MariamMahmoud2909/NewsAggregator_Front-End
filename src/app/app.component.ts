import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';


@Component({
    selector: 'app-root',
    imports: [RouterOutlet,ToastrModule, NgxSpinnerComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'news';
}
