import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function isValidDate(companyData: any): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const date = new Date(group.get('date')?.value);

    const vacationStart = new Date(companyData.vacationPeriod.start);
    const vacationEnd = new Date(companyData.vacationPeriod.end);

    date.setFullYear(vacationStart.getFullYear());

    if (date >= vacationStart && date <= vacationEnd) {
      return { dateInvalid: true };
    }

    return null;
  };
}

export function isValidPrivateArea(gardenAreaForm: any): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const poolArea = group.get('poolArea')?.value;
    const greenArea = group.get('greenArea')?.value;
    const furnitureArea = group.get('furnitureArea')?.value;

    const gardenArea = gardenAreaForm.get('gardenArea')?.value;

    if (gardenArea != poolArea + greenArea + furnitureArea) {
      return { gardenAreaInvalid: true };
    }

    return null;
  };
}

export function isValidRestaurantArea(gardenAreaForm: any): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const fountainArea = group.get('fountainArea')?.value;
    const greenArea = group.get('greenArea')?.value;

    const gardenArea = gardenAreaForm.get('gardenArea')?.value;

    if (gardenArea != fountainArea + greenArea) {
      return { gardenAreaInvalid: true };
    }

    return null;
  };
}
