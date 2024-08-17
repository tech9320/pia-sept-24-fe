import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  getWorkerCount(): Observable<any> {
    return this.http.get<any>('http://localhost:4000/worker/count');
  }

  getOwnerCount(): Observable<any> {
    return this.http.get<any>('http://localhost:4000/owner/count');
  }

  getUser(username: string, password: string): Observable<any> {
    let httpParams = new HttpParams();

    httpParams = httpParams.append('username', username);
    httpParams = httpParams.append('password', password);

    return this.http.get<any>('http://localhost:4000/login/user', {
      params: httpParams,
    });
  }

  checkForUniqueEmail(email: string): Observable<any> {
    let httpParams = new HttpParams();

    httpParams = httpParams.append('email', email);

    return this.http.get<any>('http://localhost:4000/check/email', {
      params: httpParams,
    });
  }

  checkForUniqueUsername(username: string): Observable<any> {
    let httpParams = new HttpParams();

    httpParams = httpParams.append('username', username);

    return this.http.get<any>('http://localhost:4000/check/username', {
      params: httpParams,
    });
  }

  registerUser(
    username: string,
    password: string,
    name: string,
    surname: string,
    gender: string,
    address: string,
    contactNumber: string,
    email: string,
    photoBitecode: string,
    cardNumber: string
  ) {
    let data = {
      username: username,
      password: password,
      name: name,
      surname: surname,
      gender: gender,
      address: address,
      contactNumber: contactNumber,
      email: email,
      photoBitecode: photoBitecode,
      cardNumber: cardNumber,
    };

    return this.http.post<any>('http://localhost:4000/owner', data);
  }

  updateUserPassword(userType: string, userId: string, newPassword: string) {
    let data = {
      userType,
      userId,
      newPassword,
    };

    return this.http.put<any>('http://localhost:4000/password/update', data);
  }
}
