import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-worker-maintenance',
  templateUrl: './worker-maintenance.component.html',
  styleUrls: ['./worker-maintenance.component.css'],
})
export class WorkerMaintenanceComponent implements OnInit {
  today = new Date();

  requests: any[] = [];
  companies: any[] = [];
  workers: any[] = [];

  maintanences: any[] = [];

  displayedRequests: any[] = [];
  awaitingMintanences: any[] = [];

  userData = JSON.parse(sessionStorage.getItem('user_data')!);

  constructor(
    private dataService: DataService,
    private toast: ToastrService,
    private router: Router
  ) {}

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
              maintanence.requestId.companyId === this.userData['company'] &&
              maintanence.__status__ === 'waiting'
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

  logoutUser() {
    sessionStorage.removeItem('user_type');
    sessionStorage.removeItem('user_data');

    this.router.navigate(['/']);

    this.toast.success('Uspešno ste se odjavili');
  }

  updateMaintenance(dateRef: any, mintanence: any, __status__: string) {
    const date = dateRef.value;

    if (date.length === 0 && __status__ === 'approve') {
      this.toast.error('Morate uneti datum!');
      return;
    }

    this.dataService
      .updateMaintenance(
        mintanence.requestId._id,
        mintanence._id,
        this.userData['_id'],
        __status__,
        new Date(date)
      )
      .subscribe((result) => {
        if (result['status'] == 'ok') {
          this.toast.success('Uspešno ste potvrdili održavanje');
          this.getData();
        } else {
          this.toast.error('Došlo je do greške pri potvrđivanju održavanja');
          console.error(result['message']);
        }
      });
  }
}
