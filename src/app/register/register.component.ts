import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UtilsService } from '../utils.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private utilsService: UtilsService
  ) {}

  username: string = '';
  password: string = '';
  name: string = '';
  surname: string = '';
  gender: string = '';
  address: string = '';
  contactNumber: string = '';
  emailAddress: string = '';
  cardNumber: string = '';
  pictureBitecode: string | ArrayBuffer | null = '';

  cardTypeImageBasePath: string = '../../assets/images';
  cardTypeImagetypePath: string = `${this.cardTypeImageBasePath}/generic-card.png`;

  selectCardType() {
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

  registerUser() {
    this.dataService
      .checkForUniqueUsername(this.username)
      .subscribe((result) => {
        console.log(result);
      });

    if (
      this.username.length == 0 ||
      this.password.length == 0 ||
      this.name.length == 0 ||
      this.surname.length == 0 ||
      this.gender.length == 0 ||
      this.address.length == 0 ||
      this.contactNumber.length == 0 ||
      this.emailAddress.length == 0 ||
      this.cardNumber.length == 0
    ) {
      this.toastr.error('Molim Vas popunite sva polja!');
    }

    if (!this.utilsService.checkEmail(this.emailAddress)) {
      this.toastr.error('Molim Vas unesite pravilan format email adrese!');
    }

    if (this.utilsService.isCardNumberValid(this.cardNumber)) {
      this.toastr.error('Molim Vas unesite validan broj kartice!');
    }
  }
}
