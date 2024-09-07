import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-worker-requests',
  templateUrl: './worker-requests.component.html',
  styleUrls: ['./worker-requests.component.css'],
})
export class WorkerRequestsComponent {
  requests: any[] = [];
  companies: any[] = [];
  workers: any[] = [];

  displayedRequests: any[] = [];

  workerData = JSON.parse(sessionStorage.getItem('user_data')!);

  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRequest();
  }

  getWorks(request: any) {
    let str: string = '';

    for (let service of request.selectedServices) {
      str += `${service.serviceName}, `;
    }

    return str.slice(0, -2);
  }

  approveRequest(request: any) {
    this.dataService
      .updateGardenRequestStatus(request._id, this.workerData._id, 'approved')
      .subscribe((result) => {
        if (result['status'] == 'ok') {
          this.toastr.success('Uspešno ste odobrili zahtev');
          this.loadRequest();
        } else {
          this.toastr.error('Došlo je do greške pri odobrili zahteva');
          console.error(result['message']);
        }
      });
  }

  rejectRequest(textareaRef: any, request: any) {
    if (textareaRef.value.trim().length === 0) {
      this.toastr.error('Molim Vas ostavite komentar zašto odbijate zahtev!');
      return;
    }

    this.dataService
      .updateGardenRequestStatus(request._id, this.workerData._id, 'rejected')
      .subscribe((result) => {
        if (result['status'] == 'ok') {
          this.toastr.success('Uspešno ste odbili zahtev');
          this.loadRequest();
        } else {
          this.toastr.error('Došlo je do greške pri odbili zahteva');
          console.error(result['message']);
        }
      });
  }

  logoutUser() {
    sessionStorage.removeItem('user_type');
    sessionStorage.removeItem('user_data');

    this.router.navigate(['/']);

    this.toastr.success('Uspešno ste se odjavili');
  }

  loadRequest() {
    this.dataService.getAllCompanies().subscribe((result) => {
      this.companies = result['data'];

      this.dataService.getAllWorkers().subscribe((result) => {
        this.workers = result['data'];

        this.dataService.getAllRequests().subscribe((result) => {
          this.requests = result['data'];

          this.requests = this.requests.filter(
            (request) => request.__status__ === 'waiting'
          );

          this.requests = this.requests.filter(
            (request) => request.companyId === this.workerData.company
          );

          this.requests = this.requests.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          this.displayedRequests = this.requests.map((request) => {
            const company = this.companies.find(
              (company) => company._id == request.companyId
            );

            request.companyId = company;

            const worker = this.workers.find(
              (worker) => worker._id == request.workerId
            );

            request.workerId = worker;

            if (request.gardenType == 'P') {
              request.gardenType == 'Private';
            } else {
              request.gardenType == 'Restaurant';
            }

            request.requestCompletedAt = new Date(
              request.requestCompletedAt
            ).toLocaleDateString('en-GB');

            request.createdAt = new Date(request.createdAt).toLocaleDateString(
              'en-GB'
            );

            return request;
          });
        });
      });
    });
  }
}
