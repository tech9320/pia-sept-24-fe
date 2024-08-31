import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ToastrService } from 'ngx-toastr';
import { UtilsService } from '../utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-decorators',
  templateUrl: './admin-decorators.component.html',
  styleUrls: ['./admin-decorators.component.css'],
})
export class AdminDecoratorsComponent implements OnInit {
  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private utilsService: UtilsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dataService.getAllCompanies().subscribe((result) => {
      this.companies = result['data'];
    });
  }

  companies: any[] = [];
  selectedCompany: string = '';

  username: string = '';
  password: string = '';
  name: string = '';
  surname: string = '';
  gender: string = '';
  address: string = '';
  contactNumber: string = '';
  emailAddress: string = '';
  pictureBitecode: string | ArrayBuffer | null = '';

  cardTypeImageBasePath: string = '../../assets/images';
  cardTypeImagetypePath: string = `${this.cardTypeImageBasePath}/generic-card.png`;

  onPictureUpload(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const picture = input.files[0];

      if (!picture.type.startsWith('image/')) {
        this.toastr.error('Molim Vas unesite sliku u PNG ili JPG formatu!');
        return;
      }

      if (picture.size > 2 * 1024 * 1024) {
        this.toastr.error('Molim Vas unesite sliku koja ima manje od 2MB!');
        return;
      }

      const reader = new FileReader();

      reader.readAsDataURL(picture);

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const img = new Image();

        img.onload = () => {
          if (
            img.width < 100 ||
            img.width > 300 ||
            img.height < 100 ||
            img.height > 300
          ) {
            this.toastr.error(
              'Molim Vas unesite sliku odgovarajućih dimenzija!'
            );
          } else {
            this.pictureBitecode = e.target?.result!;
          }
        };

        img.src = e.target?.result as string;
      };
    }
  }

  registerWorker() {
    if (
      this.username.length == 0 ||
      this.password.length == 0 ||
      this.name.length == 0 ||
      this.surname.length == 0 ||
      this.gender.length == 0 ||
      this.address.length == 0 ||
      this.contactNumber.length == 0 ||
      this.emailAddress.length == 0 ||
      this.selectedCompany.length == 0
    ) {
      this.toastr.error('Molim Vas popunite sva polja!');
      return;
    }

    if (!this.utilsService.checkEmail(this.emailAddress)) {
      this.toastr.error('Molim Vas unesite pravilan format email adrese!');
      return;
    }

    if (!this.utilsService.checkPassword(this.password)) {
      this.toastr.error('Molim Vas unesite pravilan format lozinke!');
      return;
    }

    this.dataService
      .checkForUniqueUsername(this.username)
      .subscribe(({ message, unique }) => {
        if (message == 'error') {
          this.toastr.error('Došlo je do greške pri povezivanju sa serverom');
        } else {
          if (!unique) {
            this.toastr.error(
              'Molim Vas unesite drugo korisničko ime! Dato je već iskorišćeno!'
            );
            return;
          } else {
            this.dataService
              .checkForUniqueEmail(this.emailAddress)
              .subscribe(({ message, unique }) => {
                if (message == 'error') {
                  this.toastr.error(
                    'Došlo je do greške pri povezivanju sa serverom'
                  );
                } else {
                  if (!unique) {
                    this.toastr.error(
                      'Molim Vas unesite drugu email adresu! Data je već korišćena!'
                    );
                    return;
                  } else {
                    this.dataService
                      .registerWorker(
                        this.username,
                        this.utilsService.hashPassword(this.password),
                        this.name,
                        this.surname,
                        this.gender,
                        this.address,
                        this.contactNumber,
                        this.emailAddress,
                        this.pictureBitecode?.toString()!,
                        this.selectedCompany
                      )
                      .subscribe(({ status, message }) => {
                        if (status == 'ok') {
                          this.toastr.success(
                            'Uspešno ste podneli prijavu za registraciju korisnika!'
                          );

                          this.router.navigate(['/']);
                        } else {
                          this.toastr.error(
                            'Došlo je do greške pri čuvanju korisnika'
                          );
                          console.error(message);
                        }
                      });
                  }
                }
              });
          }
        }
      });
  }
}
