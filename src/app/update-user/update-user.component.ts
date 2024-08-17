import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ToastrService } from 'ngx-toastr';
import { UtilsService } from '../utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css'],
})
export class UpdateUserComponent implements OnInit {
  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private utilsService: UtilsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userData = JSON.parse(sessionStorage.getItem('targer_user_data')!);

    this.name = userData['name'];
    this.surname = userData['surname'];
    this.address = userData['address'];
    this.contactNumber = userData['contactNumber'];
    this.emailAddress = userData['email'];
    this.cardNumber = userData['cardNumber'];
    this.pictureBitecode = userData['photoBitecode'];

    this.selectCardType();
  }

  name: string = '';
  surname: string = '';
  address: string = '';
  contactNumber: string = '';
  emailAddress: string = '';
  cardNumber: string = '';
  pictureBitecode: string | ArrayBuffer | null = '';

  cardTypeImageBasePath: string = '../../assets/images';
  cardTypeImagetypePath: string = `${this.cardTypeImageBasePath}/generic-card.png`;

  isOwnerType() {
    return this.cardNumber;
  }

  selectCardType() {
    if (!this.cardNumber) {
      return;
    }

    if (
      this.cardNumber.length == 15 &&
      (['300', '301', '302', '303'].includes(this.cardNumber.slice(0, 3)) ||
        ['36', '38'].includes(this.cardNumber.slice(0, 2)))
    ) {
      this.cardTypeImagetypePath = `${this.cardTypeImageBasePath}/diners-club.png`;
    } else if (
      this.cardNumber.length == 16 &&
      ['51', '52', '53', '54', '55'].includes(this.cardNumber.slice(0, 2))
    ) {
      this.cardTypeImagetypePath = `${this.cardTypeImageBasePath}/mastercard.png`;
    } else if (
      this.cardNumber.length == 16 &&
      ['4539', '4556', '4916', '4532', '4929', '4485', '4716'].includes(
        this.cardNumber.slice(0, 4)
      )
    ) {
      this.cardTypeImagetypePath = `${this.cardTypeImageBasePath}/visa.png`;
    } else {
      this.cardTypeImagetypePath = `${this.cardTypeImageBasePath}/generic-card.png`;
    }
  }

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

  updateUser() {
    let userType: string = '';

    if (this.cardNumber) {
      userType = 'owner';
    } else {
      userType = 'worker';
    }

    const userData = JSON.parse(sessionStorage.getItem('targer_user_data')!);

    if (
      this.name.length == 0 ||
      this.surname.length == 0 ||
      this.address.length == 0 ||
      this.contactNumber.length == 0 ||
      this.emailAddress.length == 0 ||
      (userType == 'owner' && this.cardNumber.length == 0)
    ) {
      this.toastr.error('Molim Vas popunite sva polja!');
      return;
    }

    if (!this.utilsService.checkEmail(this.emailAddress)) {
      this.toastr.error('Molim Vas unesite pravilan format email adrese!');
      return;
    }

    if (
      userType == 'owner' &&
      !this.utilsService.isCardNumberValid(this.cardNumber)
    ) {
      this.toastr.error('Molim Vas unesite validan broj kartice!');
      return;
    }

    const userId = userData['_id'];

    this.dataService
      .updateUser(
        this.name,
        this.surname,
        this.address,
        this.contactNumber,
        this.emailAddress,
        this.pictureBitecode?.toString()!,
        this.cardNumber,
        userType,
        userId
      )
      .subscribe(({ status, message }) => {
        if (status == 'ok') {
          this.toastr.success('Uspešno ste ažurirali podatke korisnika!');

          this.router.navigate(['/admin/entities']);
        } else {
          this.toastr.error('Došlo je do greške pri ažuriranju podataka!');
          console.error(message);
        }
      });
  }
}
