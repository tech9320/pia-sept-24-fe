import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css'],
})
export class CompaniesComponent implements OnInit {
  constructor(
    private toastr: ToastrService,
    private dataService: DataService,
    private router: Router
  ) {}

  workers: any[] = [];
  companies: any[] = [];
  displayedCompanies: any[] = [];

  likeCompanyName: string = '';
  likeCompanyAddress: string = '';

  ngOnInit(): void {
    this.dataService.getAllWorkers().subscribe((result) => {
      this.workers = result['data'];
    });

    this.dataService.getAllCompanies().subscribe((result) => {
      this.companies = result['data'];
      this.displayedCompanies = this.companies;
    });
  }

  logoutUser() {
    sessionStorage.removeItem('user_type');
    sessionStorage.removeItem('user_data');

    this.router.navigate(['/']);

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

  checkoutCompany(company: any) {
    sessionStorage.setItem('selected_company_data', JSON.stringify(company));

    this.router.navigate(['companies/details']);
  }
}
