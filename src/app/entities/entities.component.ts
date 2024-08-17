import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-entities',
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.css'],
})
export class EntitiesComponent implements OnInit {
  owners: any[] = [];
  workers: any[] = [];
  companies: any[] = [];

  constructor(
    private toastr: ToastrService,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dataService.getAllWorkers().subscribe((result) => {
      this.workers = result['data'];
    });

    this.dataService.getAllCompanies().subscribe((result) => {
      this.companies = result['data'];
    });

    this.dataService.getAllOwners().subscribe((result) => {
      this.owners = result['data'];
    });
  }

  deactivateOwner(userId: string) {
    this.dataService.deactivateOwner(userId).subscribe((result) => {
      this.toastr.success('Uspešno ste deaktivirali vlasnika');

      this.dataService.getAllOwners().subscribe((result) => {
        this.owners = result['data'];
      });
    });
  }

  deactivateWorker(userId: string) {
    this.dataService.deactivateWorker(userId).subscribe((result) => {
      this.toastr.success('Uspešno ste deaktivirali korisnika');

      this.dataService.getAllWorkers().subscribe((result) => {
        this.workers = result['data'];
      });
    });
  }

  isOwnerActive(owner: any) {
    return owner.__status__ == 'approved';
  }

  isWorkerActive(worker: any) {
    return worker.__status__ == 'active';
  }

  logoutUser() {
    sessionStorage.removeItem('user_type');
    sessionStorage.removeItem('user_data');

    this.router.navigate(['/']);

    this.toastr.success('Uspešno ste se odjavili');
  }

  updateUser(user: any) {
    sessionStorage.setItem('targer_user_data', JSON.stringify(user));

    this.router.navigate(['/admin/update-user']);
  }
}
