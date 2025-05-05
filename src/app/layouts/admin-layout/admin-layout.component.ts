import { Component } from '@angular/core';
import { NavAdminComponent } from '../../components/nav-admin/nav-admin.component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-admin-layout',
    imports: [NavAdminComponent, RouterOutlet],
    templateUrl: './admin-layout.component.html',
    styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {

}
