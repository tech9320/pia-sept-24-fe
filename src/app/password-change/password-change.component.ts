import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UtilsService } from '../utils.service';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css'],
})
export class PasswordChangeComponent {
  constructor(
    private toastr: ToastrService,
    private utils: UtilsService,
    private dataService: DataService,
    private router: Router
  ) {}

  oldPassword: string = '';
  newPassword: string = '';
  newPasswordRepeat: string = '';

  logoutUser() {
    sessionStorage.removeItem('user_type');
    sessionStorage.removeItem('user_data');

    this.router.navigate(['/']);

    this.toastr.success('Uspešno ste se odjavili');
  }

  changePassword() {
    if (
      this.oldPassword.length == 0 ||
      this.newPassword.length == 0 ||
      this.newPasswordRepeat.length == 0
    ) {
      this.toastr.error('Molim Vas popunite sva polja!');
      return;
    }

    const user_data = JSON.parse(sessionStorage.getItem('user_data')!);
    const oldPasswordHash = this.utils.hashPassword(this.oldPassword);

    if (user_data['password'] != oldPasswordHash) {
      this.toastr.error('Niste uneli pravilnu trenutnu lozinku!');
      return;
    }

    if (!this.utils.checkPassword(this.newPassword)) {
      this.toastr.error('Niste uneli ispravan format lozinke!');
      return;
    }

    let newPasswordHash = this.utils.hashPassword(this.newPassword);

    let newPasswordRepeat = this.utils.hashPassword(this.newPasswordRepeat);

    if (newPasswordHash != newPasswordRepeat) {
      this.toastr.error('Niste uneli pravilno novu lozinku!');
      return;
    }

    this.dataService
      .updateUserPassword(
        sessionStorage.getItem('user_type')!,
        user_data['_id'],
        newPasswordHash
      )
      .subscribe((result) => {
        if (result.message == 'ok') {
          this.toastr.success('Uspešno ste promenili šifru!');
          sessionStorage.clear();
          this.router.navigate(['/']);
        } else {
          this.toastr.error('Došlo je do greške pri menjanju šifre!');
          console.error(result.error);
        }
      });
  }
}
