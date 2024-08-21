import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  getAvailabilityOfWorkers(companyId: string, date: Date) {
    let httpParams = new HttpParams();

    httpParams = httpParams.append('companyId', companyId);
    httpParams = httpParams.append('date', date.toDateString());

    return this.http.get<any>(
      'http://localhost:4000/company/worker-availability',
      {
        params: httpParams,
      }
    );
  }

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

  registerWorker(
    username: string,
    password: string,
    name: string,
    surname: string,
    gender: string,
    address: string,
    contactNumber: string,
    email: string,
    photoBitecode: string,
    selectedCompany: string
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
      selectedCompany: selectedCompany,
    };

    return this.http.post<any>('http://localhost:4000/worker', data);
  }

  sendRequest(
    ownerId: string,
    companyId: string,
    gardenType: string,
    gardenArea: number,
    greenArea: number,
    selectedServices: any[],
    createdAt: Date,
    requestCompletedAt: Date,
    lastMaintenanceAt: Date | undefined,
    poolArea?: number,
    fountainArea?: number,
    furnitureArea?: number,
    furnitureNumber?: number
  ) {
    let data = {
      ownerId: ownerId,
      companyId: companyId,
      gardenType: gardenType,
      gardenArea: gardenArea,
      greenArea: greenArea,
      poolArea: poolArea,
      fountainArea: fountainArea,
      furnitureArea: furnitureArea,
      furnitureNumber: furnitureNumber,
      selectedServices: selectedServices,
      createdAt: createdAt,
      requestCompletedAt: requestCompletedAt,
      lastMaintenanceAt: lastMaintenanceAt,
      __status__: 'waiting',
    };

    return this.http.post<any>('http://localhost:4000/request', data);
  }

  getAllRequests() {
    return this.http.get<any>('http://localhost:4000/request');
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

  updateUserStatus(userId: string, __status__: string) {
    let data = {
      userId,
      __status__,
    };

    return this.http.put<any>('http://localhost:4000/owner/status', data);
  }

  updateGardenRequestStatus(
    requestId: string,
    workerId: string,
    __status__: string
  ) {
    let data = {
      requestId,
      workerId,
      __status__,
    };

    return this.http.put<any>('http://localhost:4000/request/status', data);
  }

  getAllMaintenances() {
    return this.http.get<any>('http://localhost:4000/maintenance');
  }

  requestMaintenance(requestId: string, companyId: string, __status__: string) {
    const data = { requestId, companyId, __status__ };
    return this.http.post<any>('http://localhost:4000/maintenance', data);
  }

  updateMaintenance(
    requestId: string,
    maintenanceId: string,
    workerId: string,
    __status__: string,
    date: Date
  ) {
    let data = { requestId, maintenanceId, workerId, __status__, date };

    return this.http.put<any>('http://localhost:4000/maintenance', data);
  }
}
