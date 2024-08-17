import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  getAllOwners() {
    return this.http.get<any>('http://localhost:4000/owner');
  }

  deactivateOwner(ownerId: string) {
    let data = {
      userId: ownerId,
    };

    return this.http.put<any>('http://localhost:4000/owner/deactivate', data);
  }

  deactivateWorker(workerId: string) {
    let data = {
      userId: workerId,
    };

    return this.http.put<any>('http://localhost:4000/worker/deactivate', data);
  }

  getAllCompanies() {
    return this.http.get<any>('http://localhost:4000/company');
  }

  getAllWorkers() {
    return this.http.get<any>('http://localhost:4000/worker');
  }

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

  getAdmin(username: string, password: string): Observable<any> {
    let httpParams = new HttpParams();

    httpParams = httpParams.append('username', username);
    httpParams = httpParams.append('password', password);

    console.log(httpParams);

    return this.http.get<any>('http://localhost:4000/login/admin', {
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

  updateUser(
    name: string,
    surname: string,
    address: string,
    contactNumber: string,
    email: string,
    photoBitecode: string,
    cardNumber: string,
    userType: string,
    userId: string
  ) {
    let data = {
      name: name,
      surname: surname,
      address: address,
      contactNumber: contactNumber,
      email: email,
      photoBitecode: photoBitecode,
      cardNumber: cardNumber,
      userId,
    };

    if (userType == 'owner') {
      return this.http.put<any>('http://localhost:4000/owner', data);
    } else {
      return this.http.put<any>('http://localhost:4000/worker', data);
    }
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
