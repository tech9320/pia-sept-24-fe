import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../data.service';

@Component({
  selector: 'app-all-requests',
  templateUrl: './all-requests.component.html',
  styleUrls: ['./all-requests.component.css'],
})
export class AllRequestsComponent implements OnInit {
  requests: any[] = [];
  companies: any[] = [];
  workers: any[] = [];

  displayedRequests: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getAllCompanies().subscribe((result) => {
      this.companies = result['data'];

      this.dataService.getAllWorkers().subscribe((result) => {
        this.workers = result['data'];

        this.dataService.getAllRequests().subscribe((result) => {
          this.requests = result['data'];

          console.log(result['data']);

          this.requests = this.requests.filter(
            (request) =>
              request.__status__ === 'waiting' ||
              (request.__status__ === 'approved' &&
                new Date() < new Date(request.requestCompletedAt))
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

  getWorks(request: any) {
    let str: string = '';

    for (let service of request.selectedServices) {
      str += `${service.serviceName}, `;
    }

    return str.slice(0, -2);
  }
}
