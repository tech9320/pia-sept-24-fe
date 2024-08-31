import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UtilsService } from '../utils.service';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-company',
  templateUrl: './admin-company.component.html',
  styleUrls: ['./admin-company.component.css'],
})
export class AdminCompanyComponent {
  today = new Date();

  companyFormGroup: FormGroup = new FormGroup({});
  firstWorkerFormGroup: FormGroup = new FormGroup({});
  secondWorkerFormGroup: FormGroup = new FormGroup({});

  companyName: string = '';
  companyAddress: string = '';
  companyServices: string = '';
  companyNumber: string = '';
  companyLocation: string = '';
  vacationStart: Date | undefined = undefined;
  vacationEnd: Date | undefined = undefined;

  companyServicesJSON = {};
  companyLocationJSON = {};

  firstWorkerUsername: string = '';
  firstWorkerPassword: string = '';
  firstWorkerName: string = '';
  firstWorkerSurname: string = '';
  firstWorkerGender: string = '';
  firstWorkerAddress: string = '';
  firstWorkerPhoneNumber: string = '';
  firstWorkerEmailAddress: string = '';
  firstWorkerPictureBitcode: string | ArrayBuffer | null = '';

  secondWorkerUsername: string = '';
  secondWorkerPassword: string = '';
  secondWorkerName: string = '';
  secondWorkerSurname: string = '';
  secondWorkerGender: string = '';
  secondWorkerAddress: string = '';
  secondWorkerPhoneNumber: string = '';
  secondWorkerEmailAddress: string = '';
  secondWorkerPictureBitcode: string | ArrayBuffer | null = '';

  constructor(
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private utilsService: UtilsService,
    private dataService: DataService,
    private router: Router
  ) {
    this.companyFormGroup = this._formBuilder.group({
      companyName: ['', Validators.required],
      companyAddress: ['', Validators.required],
      companyServices: ['', Validators.required],
      companyNumber: ['', Validators.required],
      companyLocation: ['', Validators.required],
      vacationStart: ['', Validators.required],
      vacationEnd: ['', Validators.required],
    });
    this.firstWorkerFormGroup = this._formBuilder.group({
      firstWorkerUsername: ['', Validators.required],
      firstWorkerPassword: ['', Validators.required],
      firstWorkerName: ['', Validators.required],
      firstWorkerSurname: ['', Validators.required],
      firstWorkerGender: ['', Validators.required],
      firstWorkerAddress: ['', Validators.required],
      firstWorkerPhoneNumber: ['', Validators.required],
      firstWorkerEmailAddress: ['', Validators.required],
    });
    this.secondWorkerFormGroup = this._formBuilder.group({
      secondWorkerUsername: ['', Validators.required],
      secondWorkerPassword: ['', Validators.required],
      secondWorkerName: ['', Validators.required],
      secondWorkerSurname: ['', Validators.required],
      secondWorkerGender: ['', Validators.required],
      secondWorkerAddress: ['', Validators.required],
      secondWorkerPhoneNumber: ['', Validators.required],
      secondWorkerEmailAddress: ['', Validators.required],
    });
  }

  onPictureUpload(event: Event, workerNumber: number) {
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
            if (workerNumber === 0) {
              this.firstWorkerPictureBitcode = e.target?.result!;
            } else {
              this.secondWorkerPictureBitcode = e.target?.result!;
            }
          }
        };

        img.src = e.target?.result as string;
      };
    }
  }

  logoutUser() {
    sessionStorage.removeItem('user_type');
    sessionStorage.removeItem('user_data');

    this.router.navigate(['/']);

    this.toastr.success('Uspešno ste se odjavili');
  }

  saveCompany() {
    if (!this.checkCompanyInfo() || !this.checkWorkerInfoBasic()) {
      return;
    }

    const firstWorkerEmailAddress = this.firstWorkerFormGroup.get(
      'firstWorkerEmailAddress'
    )?.value;
    const secondWorkerEmailAddress = this.secondWorkerFormGroup.get(
      'secondWorkerEmailAddress'
    )?.value;

    const firstWorkerUsername = this.firstWorkerFormGroup.get(
      'firstWorkerUsername'
    )?.value;
    const secondWorkerUsername = this.secondWorkerFormGroup.get(
      'secondWorkerUsername'
    )?.value;

    this.dataService
      .checkForUniqueEmail(firstWorkerEmailAddress)
      .subscribe(({ message, unique }) => {
        if (message == 'error') {
          this.toastr.error('Došlo je do greške pri povezivanju sa serverom');
        } else {
          if (!unique) {
            this.toastr.error(
              'Molim Vas unesite drugu email adresu za prvog radnika! Data je već korišćena!'
            );
            return;
          } else {
            this.dataService
              .checkForUniqueEmail(secondWorkerEmailAddress)
              .subscribe(({ message, unique }) => {
                if (message == 'error') {
                  this.toastr.error(
                    'Došlo je do greške pri povezivanju sa serverom'
                  );
                } else {
                  if (!unique) {
                    this.toastr.error(
                      'Molim Vas unesite drugu email adresu za drugog radnika! Data je već korišćena!'
                    );
                    return;
                  } else {
                    this.dataService
                      .checkForUniqueUsername(firstWorkerUsername)
                      .subscribe(({ message, unique }) => {
                        if (message == 'error') {
                          this.toastr.error(
                            'Došlo je do greške pri povezivanju sa serverom'
                          );
                        } else {
                          if (!unique) {
                            this.toastr.error(
                              'Molim Vas unesite drugo korisničko ime za prvog radnika! Dato je već korišćeno!'
                            );
                            return;
                          } else {
                            this.dataService
                              .checkForUniqueUsername(secondWorkerUsername)
                              .subscribe(({ message, unique }) => {
                                if (message == 'error') {
                                  this.toastr.error(
                                    'Došlo je do greške pri povezivanju sa serverom'
                                  );
                                } else {
                                  if (!unique) {
                                    this.toastr.error(
                                      'Molim Vas unesite drugo korisničko ime za drugog radnika! Dato je već korišćeno!'
                                    );
                                    return;
                                  } else {
                                    const vacationStart =
                                      this.companyFormGroup.get(
                                        'vacationStart'
                                      )!.value;

                                    const vacationEnd =
                                      this.companyFormGroup.get(
                                        'vacationEnd'
                                      )!.value;

                                    this.dataService
                                      .registerCompany(
                                        this.companyName,
                                        this.companyAddress,
                                        JSON.parse(this.companyServices),
                                        this.companyNumber,
                                        JSON.parse(this.companyLocation),
                                        vacationStart,
                                        vacationEnd
                                      )
                                      .subscribe(({ message, data }) => {
                                        if (message == 'error') {
                                          this.toastr.error(
                                            'Došlo je do greške pri čuvanju nove kompanije!'
                                          );
                                          console.error(data);
                                        } else {
                                          const companyId = data._id;

                                          this.dataService
                                            .registerWorker(
                                              this.firstWorkerUsername,
                                              this.utilsService.hashPassword(
                                                this.firstWorkerPassword
                                              ),
                                              this.firstWorkerName,
                                              this.firstWorkerSurname,
                                              this.firstWorkerGender,
                                              this.firstWorkerAddress,
                                              this.firstWorkerPhoneNumber,
                                              this.firstWorkerEmailAddress,
                                              this.firstWorkerPictureBitcode?.toString()!,
                                              companyId
                                            )
                                            .subscribe(
                                              ({ status, message }) => {
                                                if (message == 'error') {
                                                  this.toastr.error(
                                                    'Došlo je do greške pri čuvanju nove kompanije!'
                                                  );
                                                  console.error(data);
                                                } else {
                                                  this.dataService
                                                    .registerWorker(
                                                      this.secondWorkerUsername,
                                                      this.utilsService.hashPassword(
                                                        this
                                                          .secondWorkerPassword
                                                      ),
                                                      this.secondWorkerName,
                                                      this.secondWorkerSurname,
                                                      this.secondWorkerGender,
                                                      this.secondWorkerAddress,
                                                      this
                                                        .secondWorkerPhoneNumber,
                                                      this
                                                        .secondWorkerEmailAddress,
                                                      this.secondWorkerPictureBitcode?.toString()!,
                                                      companyId
                                                    )
                                                    .subscribe(
                                                      ({ status, message }) => {
                                                        if (status == 'ok') {
                                                          this.toastr.success(
                                                            'Uspešno ste sačuvali novu firmu!'
                                                          );

                                                          this.router.navigate([
                                                            '/',
                                                          ]);
                                                        } else {
                                                          this.toastr.error(
                                                            'Došlo je do greške pri čuvanju firme!'
                                                          );
                                                          console.error(
                                                            message
                                                          );
                                                        }
                                                      }
                                                    );
                                                }
                                              }
                                            );
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
              });
          }
        }
      });
  }

  checkCompanyInfo() {
    try {
      this.companyServicesJSON = JSON.parse(this.companyServices);
    } catch {
      this.toastr.error('Molim Vas unesite pravilni format za usluge firme!');
      return false;
    }

    try {
      this.companyLocationJSON = JSON.parse(this.companyLocation);
    } catch {
      this.toastr.error('Molim Vas unesite pravilni format za lokaciju firme!');
      return false;
    }

    if (this.vacationEnd! <= this.vacationStart!) {
      this.toastr.error('Molim Vas unesite validno vreme za odmor u firmi!');
      return false;
    }

    return true;
  }

  checkWorkerInfoBasic() {
    if (!this.utilsService.checkEmail(this.firstWorkerEmailAddress)) {
      this.toastr.error(
        'Molim Vas unesite pravilan format email adrese za prvog radnika!'
      );
      return false;
    }

    if (!this.utilsService.checkPassword(this.firstWorkerPassword)) {
      this.toastr.error(
        'Molim Vas unesite pravilan format lozinke za prvog radnika!'
      );
      return false;
    }

    if (!this.utilsService.checkEmail(this.secondWorkerEmailAddress)) {
      this.toastr.error(
        'Molim Vas unesite pravilan format email adrese za drugog radnika!'
      );
      return false;
    }

    if (!this.utilsService.checkPassword(this.secondWorkerPassword)) {
      this.toastr.error(
        'Molim Vas unesite pravilan format lozinke za drugog radnika!'
      );
      return false;
    }

    return true;
  }
}
