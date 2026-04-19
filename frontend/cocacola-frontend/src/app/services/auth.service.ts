import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiRegister = 'http://127.0.0.1:8000/api/users/register/';
  private apiLogin = 'http://127.0.0.1:8000/api/users/login/';

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post(this.apiLogin, {
      username,
      password
    });
  }

  register(data: any) {
    return this.http.post(this.apiRegister, data);
  }
}