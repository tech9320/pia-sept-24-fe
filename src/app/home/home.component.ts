import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(
    private toastr: ToastrService,
    private dataService: DataService
  ) {}

  isUser: boolean = true;

  workers: any[] = [];
  companies: any[] = [];
  displayedCompanies: any[] = [];
  fullWorkerData: any[] = [];

  likeCompanyName: string = '';
  likeCompanyAddress: string = '';

  ngOnInit(): void {
    sessionStorage.removeItem('worker_data');
    sessionStorage.removeItem('owner_data');

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
    });
  }

  showInfo(message: string) {
    this.toastr.info(message);
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

  workerCount = 0;
  ownerCount = 0;

  availableTimes = [
    { displayValue: '24 sata', actualValue: 1 },
    { displayValue: '7 data', actualValue: 7 },
    { displayValue: '30 dana', actualValue: 30 },
  ];

  selectedTime: string = this.availableTimes[0].displayValue;

  contractCount: number = this.availableTimes[0].actualValue;

  updateContactCount(event: Event): void {
    // const selectedElement = event.target as HTMLSelectElement;
    // const selectedDisplayValue = selectedElement.value;
    // const selectedValue = this.availableTimes.find(
    //   (time) => time.displayValue == selectedDisplayValue
    // );
    // if (selectedValue) {
    //   let result = selectedValue?.actualValue * 10;
    //   this.showInfo(result.toString());
    // }
  }
}
