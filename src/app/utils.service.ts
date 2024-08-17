import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  hashPassword(password: string): string {
    const hash = CryptoJS.SHA256(password);

    return hash.toString();
  }

  checkPassword(password: string): boolean {
    const regex =
      /^(?=.*\d)(?=.*[\W_])(?=.*[A-Z])(?=(?:[^a-z]*[a-z]){3})[a-zA-Z].{5,9}$/;

    return regex.test(password);
  }

  checkEmail(email: string): boolean {
    const reger = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return reger.test(email);
  }

  isCardNumberValid(cardNumber: string): boolean {
    if (isNaN(parseFloat(cardNumber)) || !isFinite(Number(cardNumber))) {
      return false;
    }

    if (cardNumber.length < 15 || cardNumber.length > 16) {
      return false;
    }

    if (
      cardNumber.length == 15 &&
      (['300', '301', '302', '303'].includes(cardNumber.slice(0, 3)) ||
        ['36', '38'].includes(cardNumber.slice(0, 2)))
    ) {
      return true;
    } else if (
      cardNumber.length == 16 &&
      ['51', '52', '53', '54', '55'].includes(cardNumber.slice(0, 2))
    ) {
      return true;
    } else if (
      cardNumber.length == 16 &&
      ['4539', '4556', '4916', '4532', '4929', '4485', '4716'].includes(
        cardNumber.slice(0, 4)
      )
    ) {
      return true;
    } else {
      return false;
    }
  }
}
