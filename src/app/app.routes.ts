import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ContactComponent } from './components/contact/contact.component';
import { SavedNewsComponent } from './components/saved-news/saved-news.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { CategoryComponent } from './components/category/category.component';
import { ArticleComponent } from './components/article/article.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { authGuard } from './core/guards/auth.guard';
import { logedGuard } from './core/guards/loged.guard';
import { ForgetpasswordComponent } from './components/forgetpassword/forgetpassword.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AdminComponent } from './components/admin/admin.component';
import { adminGuard } from './core/guards/admin.guard';
import { CommentsComponent } from './components/comments/comments.component';
import { SpecificUserCommentsComponent } from './components/specific-user-comments/specific-user-comments.component';
import { AdminSettingsComponent } from './components/admin-settings/admin-settings.component';
import { CommentPopUpComponent } from './components/comment-pop-up/comment-pop-up.component';

export const routes: Routes = [
  {path:'', component:AuthLayoutComponent, canActivate:[logedGuard], children:[
    {path:'', redirectTo:'login', pathMatch:'full'},
    {path:'login', component:LoginComponent},
    {path:'register', component:RegisterComponent},
    {path:'forgetpassword', component:ForgetpasswordComponent},
  ]},

  {path:'', component:BlankLayoutComponent, canActivate:[authGuard], children:[
    {path:'', redirectTo:'home', pathMatch:'full'},
    {path:'home', component:HomeComponent},
    {path:'contact', component:ContactComponent},
    {path:'savednews', component:SavedNewsComponent},
    {path:'categories', component:CategoriesComponent},
    {path:'category/:categoryName', component:CategoryComponent},
    {path:'article/:id', component:ArticleComponent},
    {path:'edit-profile', component:EditProfileComponent},
    // {path:'Comment-pop-up', component:CommentPopUpComponent},
  ]},

  {path: '', component:AdminLayoutComponent, canActivate:[adminGuard], children:[
    {path:'', redirectTo:'admin', pathMatch:'full'},
    {path:'admin', component:AdminComponent},
    {path:'comments', component:CommentsComponent},
    {path:'specific-user-comments/:id', component:SpecificUserCommentsComponent},
    {path:'admin-settings', component:AdminSettingsComponent},
  ]},

  {path:'**', component:NotfoundComponent}
];
