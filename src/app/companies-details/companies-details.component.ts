import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-companies-details',
  templateUrl: './companies-details.component.html',
  styleUrls: ['./companies-details.component.css'],
})
export class CompaniesDetailsComponent implements OnInit {
  ngOnInit(): void {
    this.companyData = JSON.parse(sessionStorage['selected_company_data']);
  }

  companyData: any = {};
}
