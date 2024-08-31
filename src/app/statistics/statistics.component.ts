import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Chart } from 'angular-highcharts';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent implements OnInit {
  requests: any[] = [];
  maintenances: any[] = [];

  workers: any[] = [];

  userData = JSON.parse(sessionStorage.getItem('user_data')!);

  userWorkPerMonth: number[] = new Array(12).fill(0);
  companyWorkerWorks: Map<string, number> = new Map<string, number>();

  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  barChart = new Chart({
    chart: { type: 'column' },
    title: { text: 'Raspodela poslova po mesecu' },
    xAxis: {
      categories: [
        'Januar',
        'Februar',
        'Mart',
        'April',
        'Maj',
        'Jun',
        'Jul',
        'Avgust',
        'Septembar',
        'Oktobar',
        'Novembar',
        'Decembar',
      ],
    },
    yAxis: { title: { text: 'Broj poslova u mesecu' } },
    series: [],
    tooltip: {
      formatter: function () {
        return `<b>${this.y}</b>`;
      },
    },
  });

  pieChart = new Chart({
    chart: { type: 'pie' },
    title: { text: 'Broj radova po radniku firme' },
    series: [],
    tooltip: {
      formatter: function () {
        return `<b>${this.y}</b>`;
      },
    },
  });

  histogramChart = new Chart({
    chart: {
      type: 'column',
    },
    title: {
      text: 'Prosecan broj poslova po danu',
    },
    xAxis: [
      {
        title: { text: 'Dan u mesecu' },
        categories: [
          'Nedelja',
          'Ponedeljak',
          'Utorak',
          'Sreda',
          'Četvrtak',
          'Petak',
          'Subota',
        ],
        crosshair: false,
        alignTicks: false,
      },
    ],
    yAxis: [
      {
        min: 0,
        title: { text: 'Broj poslova' },
      },
    ],
    series: [],
    tooltip: {
      formatter: function () {
        return `<b>${this.y}</b>`;
      },
    },
  });

  ngOnInit(): void {
    this.dataService.getAllMaintenances().subscribe((result) => {
      this.maintenances = result['data'];

      this.maintenances = this.maintenances.filter(
        (maintenance) => maintenance.__status__ === 'approved'
      );

      this.dataService.getAllRequests().subscribe((result) => {
        this.requests = result['data'];

        this.requests = this.requests.filter(
          (request) => request.__status__ === 'approved'
        );
      });

      this.dataService.getAllWorkers().subscribe((result) => {
        this.workers = result['data'];

        this.workers = this.workers.filter(
          (worker) => worker.company === this.userData.company
        );

        this.calculateWorkerWorksPerMonth();
        this.calculateCompanyWorkerWorks();
        this.calculateWorksPerDay();
      });
    });
  }

  calculateWorkerWorksPerMonth() {
    this.requests.forEach((request) => {
      if (request.workerId === this.userData['_id']) {
        const month = new Date(request.requestCompletedAt).getMonth();

        this.userWorkPerMonth[month] = this.userWorkPerMonth[month] + 1;
      }
    });

    this.maintenances.forEach((maintenance) => {
      if (maintenance.workerId === this.userData['_id']) {
        const month = new Date(maintenance.completedAt).getMonth();

        this.userWorkPerMonth[month] = this.userWorkPerMonth[month] + 1;
      }
    });

    this.barChart.addSeries(
      {
        type: 'column',
        data: this.userWorkPerMonth,
        showInLegend: false,
      },
      true,
      true
    );
  }

  calculateCompanyWorkerWorks() {
    for (let worker of this.workers) {
      let works = 0;

      const name = `${worker.name} ${worker.surname}`;

      for (let request of this.requests) {
        if (
          request.workerId === worker._id &&
          request.companyId === this.userData.company
        ) {
          works++;
        }
      }

      for (let maintenance of this.maintenances) {
        if (
          maintenance.workerId === worker._id &&
          maintenance.companyId === this.userData.company
        ) {
          works++;
        }
      }

      this.companyWorkerWorks.set(name, works);
    }

    let series: any[] = [];

    this.companyWorkerWorks.forEach((value, key) => {
      series.push({ name: key, y: value });
    });

    this.pieChart.addSeries(
      {
        type: 'pie',
        data: series,
        showInLegend: false,
      },
      true,
      true
    );
  }

  logoutUser() {
    sessionStorage.removeItem('user_type');
    sessionStorage.removeItem('user_data');

    this.router.navigate(['/']);

    this.toastr.success('Uspešno ste se odjavili');
  }

  calculateWorksPerDay() {
    const twoYearsDate = new Date(
      new Date().setFullYear(new Date().getFullYear() - 2)
    );

    let worksPerDay: number[] = Array<number>(7).fill(0);

    const filteredRequests = this.requests.filter(
      (request) => new Date(request.requestCompletedAt) >= twoYearsDate
    );

    const filteredMaintenances = this.maintenances.filter(
      (maintenance) => new Date(maintenance.completedAt) >= twoYearsDate
    );

    for (let request of filteredRequests) {
      const day = new Date(request.requestCompletedAt).getDay();

      worksPerDay[day] = worksPerDay[day] + 1;
    }

    for (let maintenance of filteredMaintenances) {
      const day = new Date(maintenance.completedAt).getDay();

      worksPerDay[day] = worksPerDay[day] + 1;
    }

    this.histogramChart.addSeries(
      {
        data: worksPerDay,
        type: 'column',
        showInLegend: false,
      },
      true,
      true
    );
  }
}
