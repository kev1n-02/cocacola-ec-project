import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private apiUrl = 'http://127.0.0.1:8000/api/users';

  constructor(private http: HttpClient) {}

  getProfile(userId: number) {
    return this.http.post(`${this.apiUrl}/profile/`, {
      user_id: userId
    });
  }

  updateProfile(data: any) {
    return this.http.put(`${this.apiUrl}/profile/update/`, data);
  }

  changePassword(data: any) {
    return this.http.put(`${this.apiUrl}/change-password/`, data);
  }

  deleteAccount(userId: number) {
    return this.http.request('delete', `${this.apiUrl}/delete/`, {
      body: { user_id: userId }
    });
  }
}