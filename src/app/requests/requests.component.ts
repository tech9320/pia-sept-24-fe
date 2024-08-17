import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css'],
})
export class RequestsComponent implements OnInit {
  owners: any[] = [];

  constructor(
    private toastr: ToastrService,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dataService.getAllOwners().subscribe((result) => {
      let owners = result['data'];
      owners = owners.filter((owner: any) => owner.__status__ == 'awaiting');

      this.owners = owners;
    });
  }

  logoutUser() {
    sessionStorage.removeItem('user_type');
    sessionStorage.removeItem('user_data');

    this.router.navigate(['/']);

    this.toastr.success('Uspešno ste se odjavili');
  }

  changeUserStatus(owner: any, __status__: string) {
    this.dataService
      .updateUserStatus(owner._id, __status__)
      .subscribe((result) => {
        this.toastr.success('Uspešno ste ažurirali status korisnika!');

        this.dataService.getAllOwners().subscribe((result) => {
          let owners = result['data'];
          owners = owners.filter(
            (owner: any) => owner.__status__ == 'awaiting'
          );

          this.owners = owners;
        });
      });
  }
}
