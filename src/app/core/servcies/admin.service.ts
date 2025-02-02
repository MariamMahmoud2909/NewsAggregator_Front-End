import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly _HttpClient = inject(HttpClient);


  userCount: number = 0;
  commentCount: number = 0;

  getAllUsers(): Observable<any> {
    const token = localStorage.getItem('userToken');
    return this._HttpClient.get(`${environment.baseUrl}/api/admin/all-users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getAllComments(): Observable<any> {
    const token = localStorage.getItem('userToken');
    return this._HttpClient.get(`${environment.baseUrl}/api/comment`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  deleteComment(commentId: string): Observable<void> {
    const token = localStorage.getItem('userToken');
    return this._HttpClient.delete<void>(`${environment.baseUrl}/api/comment/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    } );
  }

  getSpecificUserComments(userId: string | null): Observable<any> {
    const token = localStorage.getItem('userToken');
    return this._HttpClient.get(`${environment.baseUrl}/api/comment/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getUserCount(): Observable<number> {
    return this.getAllUsers().pipe(map(users => users.length));
  }

  getCommentCount(): Observable<number> {
    return this.getAllComments().pipe(map(comments => comments.length));
  }


  lockUser(userId: string): Observable<any> {
    const token = localStorage.getItem('userToken');
    return this._HttpClient.post(`${environment.baseUrl}/api/admin/lock-user/${userId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  unlockUser(userId: string): Observable<any> {
    const token = localStorage.getItem('userToken');
    return this._HttpClient.post(`${environment.baseUrl}/api/admin/unlock-user/${userId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}
