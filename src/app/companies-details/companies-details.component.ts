import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-companies-details',
  templateUrl: './companies-details.component.html',
  styleUrls: ['./companies-details.component.css'],
})
export class CompaniesDetailsComponent implements OnInit {
  constructor(private toastr: ToastrService, private router: Router) {}

  ngOnInit(): void {
    this.companyData = JSON.parse(sessionStorage['selected_company_data']);
  }

  companyData: any = {};

  logoutUser() {
    sessionStorage.removeItem('user_type');
    sessionStorage.removeItem('user_data');

    this.router.navigate(['/']);

    this.toastr.success('Uspešno ste se odjavili');
  }
}
