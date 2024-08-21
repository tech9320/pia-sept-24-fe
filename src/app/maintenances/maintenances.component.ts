import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-maintenances',
  templateUrl: './maintenances.component.html',
  styleUrls: ['./maintenances.component.css'],
})
export class MaintenancesComponent {
  requests: any[] = [];
  companies: any[] = [];
  workers: any[] = [];

  maintanences: any[] = [];

  displayedRequests: any[] = [];
  awaitingMintanences: any[] = [];

  userData = JSON.parse(sessionStorage.getItem('user_data')!);

  constructor(private dataService: DataService, private toast: ToastrService) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.dataService.getAllCompanies().subscribe((result) => {
      this.companies = result['data'];

      this.dataService.getAllWorkers().subscribe((result) => {
        this.workers = result['data'];

        this.dataService.getAllRequests().subscribe((result) => {
          this.requests = result['data'];

          this.requests = this.requests.filter(
            (request) =>
              request.__status__ === 'approved' &&
              request.ownerId === this.userData['_id']
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

        this.dataService.getAllMaintenances().subscribe((result) => {
          this.maintanences = result['data'];

          this.maintanences = this.maintanences.map((maintanence) => {
            const company = this.companies.find(
              (company) => company._id == maintanence.companyId
            );

            maintanence.companyId = company;

            const worker = this.workers.find(
              (worker) => worker._id == maintanence.workerId
            );

            maintanence.workerId = worker;

            const request = this.requests.find(
              (request) => request._id == maintanence.requestId
            );

            maintanence.requestId = request;

            return maintanence;
          });

          this.awaitingMintanences = this.maintanences.filter(
            (maintanence) =>
              maintanence.requestId.ownerId === this.userData['_id'] &&
              (maintanence.__status__ === 'waiting' ||
                new Date() < new Date(maintanence.completedAt))
          );

          this.awaitingMintanences = this.awaitingMintanences.map(
            (awaiting) => {
              awaiting.completedAt = new Date(
                awaiting.completedAt
              ).toLocaleDateString('en-GB');

              return awaiting;
            }
          );
        });
      });
    });
  }

  getWaterArea(request: any) {
    if (request.poolArea) {
      return request.poolArea;
    }

    return request.fountainArea;
  }

  isValidForMaintanence(request: any) {
    const past = new Date(request.lastMaintenanceAt);
    const sixMonthsPassed = new Date(past.setMonth(past.getMonth() + 6));

    return new Date() > sixMonthsPassed;
  }

  requestMaintenance(request: any) {
    this.dataService
      .requestMaintenance(request._id, request.companyId._id, 'waiting')
      .subscribe((result) => {
        if (result['status'] == 'ok') {
          this.toast.success('Uspešno ste poslali zahtev za dekorisanje bašte');
          this.getData();
        } else {
          this.toast.error('Došlo je do greške pri čuvanju zahteva');
          console.error(result['message']);
        }
      });
  }
}
