import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../data.service';
import { UtilsService } from '../utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(
    private toastr: ToastrService,
    private dataService: DataService,
    private utilsService: UtilsService,
    private router: Router
  ) {}

  usernameValue: string = '';
  passwordValue: string = '';

  loginUser() {
    if (this.usernameValue.length == 0 || this.passwordValue.length == 0) {
      this.toastr.error(
        'Molim Vas popunite sva polja prilikom prijavljivanja!'
      );

      return;
    }

    let password = this.utilsService.hashPassword(this.passwordValue);

    this.dataService
      .getUser(this.usernameValue, password)
      .subscribe((result) => {
        if (result.message == 'non-existing') {
          this.toastr.error('Korisnik sa datim kredencijalima ne postoji!');
        } else if (result.message == 'worker' || result.message == 'owner') {
          sessionStorage.setItem('user_type', result.message);
          sessionStorage.setItem('user_data', JSON.stringify(result.data));

          this.toastr.success('Uspešno ste je prijavili na servis');

          this.router.navigate(['/']);
        } else {
          this.toastr.error('Došlo je do greške pri povezivanju sa serverom!');
          console.error(result.data);
        }
      });
  }
}
