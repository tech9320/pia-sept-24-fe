import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  workerCount: number = 0;
  ownerCount: number = 0;
  gardenCount: number = 0;
  contractCount: number = 0;

  constructor(
    private toastr: ToastrService,
    private dataService: DataService,
    private router: Router
  ) {}

  isUser: boolean = true;

  workers: any[] = [];
  companies: any[] = [];
  displayedCompanies: any[] = [];
  fullWorkerData: any[] = [];

  requests: any[] = [];
  maintanences: any[] = [];

  likeCompanyName: string = '';
  likeCompanyAddress: string = '';

  ngOnInit(): void {
    sessionStorage.removeItem('worker_data');
    sessionStorage.removeItem('owner_data');
    sessionStorage.removeItem('selected_company_data');

    this.dataService.getWorkerCount().subscribe((result) => {
      this.workerCount = result.data;
    });

    this.dataService.getOwnerCount().subscribe((result) => {
      this.ownerCount = result.data;
    });

    this.dataService.getAllWorkers().subscribe((result) => {
      this.workers = result['data'];

      this.dataService.getAllCompanies().subscribe((result) => {
        this.companies = result['data'];
        this.displayedCompanies = this.companies;

        this.fullWorkerData = this.workers.map((worker) => {
          const company = this.companies.find(
            (company) => company._id == worker.company
          );

          worker.company = company;

          return worker;
        });
      });

      this.dataService.getAllRequests().subscribe((result) => {
        this.requests = result['data'];

        this.requests = this.requests.filter(
          (request) => request.__status__ === 'approved'
        );

        for (let request of this.requests) {
          if (new Date(request.requestCompletedAt) < new Date()) {
            this.gardenCount = this.gardenCount + 1;
          }
        }

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

          this.maintanences = this.maintanences.filter(
            (maintenance) => maintenance.__status__ === 'approved'
          );

          this.requests = this.requests.sort(
            (a, b) =>
              new Date(b.requestCompletedAt).getTime() -
              new Date(a.requestCompletedAt).getTime()
          );

          this.maintanences = this.maintanences.sort(
            (a, b) =>
              new Date(b.completedAt).getTime() -
              new Date(a.completedAt).getTime()
          );

          this.findOutNumberOfJobs(1);
        });
      });
    });
  }

  isLoggedIn(): boolean {
    if (sessionStorage.getItem('user_type')) {
      return true;
    }

    return false;
  }

  isLoggedInWorker(): boolean {
    if (
      sessionStorage.getItem('user_type') &&
      sessionStorage.getItem('user_type') == 'worker'
    ) {
      return true;
    }

    return false;
  }

  isLoggedInOwner(): boolean {
    if (
      sessionStorage.getItem('user_type') &&
      sessionStorage.getItem('user_type') == 'owner'
    ) {
      return true;
    }

    return false;
  }

  isLoggedInAdmin(): boolean {
    if (
      sessionStorage.getItem('user_type') &&
      sessionStorage.getItem('user_type') == 'admin'
    ) {
      return true;
    }

    return false;
  }

  logoutUser() {
    sessionStorage.removeItem('user_type');
    sessionStorage.removeItem('user_data');

    this.toastr.success('Uspešno ste se odjavili');
  }

  sortDescByCompanyName() {
    this.displayedCompanies = this.displayedCompanies.sort((a, b) =>
      b.name.localeCompare(a.name)
    );
  }
  sortAscByCompanyName() {
    this.displayedCompanies = this.displayedCompanies.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }
  sortDescByCompanyAddress() {
    this.displayedCompanies = this.displayedCompanies.sort((a, b) =>
      b.address.localeCompare(a.address)
    );
  }
  sortAscByCompanyAddress() {
    this.displayedCompanies = this.displayedCompanies.sort((a, b) =>
      a.address.localeCompare(b.address)
    );
  }

  searchCompanies() {
    if (
      this.likeCompanyAddress.length == 0 &&
      this.likeCompanyName.length == 0
    ) {
      this.displayedCompanies = this.companies;
      return;
    }

    if (this.likeCompanyName.length != 0) {
      this.displayedCompanies = this.displayedCompanies.filter((company) =>
        company.name.toLowerCase().includes(this.likeCompanyName.toLowerCase())
      );
      return;
    }

    if (this.likeCompanyAddress.length != 0) {
      this.displayedCompanies = this.displayedCompanies.filter((company) =>
        company.address
          .toLowerCase()
          .includes(this.likeCompanyAddress.toLowerCase())
      );
      return;
    }
  }

  availableTimes = [
    { displayValue: '24 sata', actualValue: 1 },
    { displayValue: '7 data', actualValue: 7 },
    { displayValue: '30 dana', actualValue: 30 },
  ];

  selectedTime: string = this.availableTimes[0].displayValue;

  updateContactCount(event: Event): void {
    const selectedElement = event.target as HTMLSelectElement;
    const selectedDisplayValue = selectedElement.value;

    const selectedValue = this.availableTimes.find(
      (time) => time.displayValue == selectedDisplayValue
    );

    if (selectedValue) {
      this.findOutNumberOfJobs(selectedValue.actualValue);
    }
  }

  findOutNumberOfJobs(days: number) {
    const timeBreak = new Date(new Date().setDate(new Date().getDate() - days));

    let result = 0;

    for (let request of this.requests) {
      if (new Date(request.createdAt) >= timeBreak) {
        result++;
      } else {
        break;
      }
    }

    for (let maintenance of this.maintanences) {
      if (new Date(maintenance.completedAt) >= timeBreak) {
        result++;
      } else {
        break;
      }
    }

    this.contractCount = result;
  }
}
