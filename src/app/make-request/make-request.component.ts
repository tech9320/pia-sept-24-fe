import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-make-request',
  templateUrl: './make-request.component.html',
  styleUrls: ['./make-request.component.css'],
})
export class MakeRequestComponent {
  initialFormGroup: FormGroup = new FormGroup({});
  privateFormGroup: FormGroup = new FormGroup({});
  restaurantFormGroup: FormGroup = new FormGroup({});

  gardenType = '';
  companyData = JSON.parse(sessionStorage.getItem('selected_company_data')!);
  ownerData = JSON.parse(sessionStorage.getItem('user_data')!);

  companyServices = this.companyData['services'];
  selectedServices: any[] = [];

  gardenMapJSON: string = '';
  isMapLoaded: boolean = false;

  private canvas: HTMLCanvasElement | undefined;
  private ctx: CanvasRenderingContext2D | null = null;

  constructor(
    private _formBuilder: FormBuilder,
    private toast: ToastrService,
    private dataService: DataService,
    private router: Router
  ) {
    this.initialFormGroup = this._formBuilder.group({
      date: ['', Validators.required],
      gardenArea: ['', Validators.required],
      gardenType: ['', Validators.required],
    });
    this.privateFormGroup = this._formBuilder.group({
      poolArea: ['', Validators.required],
      greenArea: ['', Validators.required],
      furnitureArea: ['', Validators.required],
    });
    this.restaurantFormGroup = this._formBuilder.group({
      fountainArea: ['', Validators.required],
      greenArea: ['', Validators.required],
      furnitureNumber: ['', Validators.required],
    });
  }

  isPrivateGarden() {
    return this.gardenType == 'P';
  }

  selectService(event: any, service: any) {
    const selected = event.target.checked;

    if (selected) {
      this.selectedServices.push(service);
    } else {
      let result = [];

      for (let selectedService of this.selectedServices) {
        if (selectedService.serviceName !== service.serviceName) {
          result.push(selectedService);
        }
      }

      this.selectedServices = result;
    }
  }

  loadGardenMap() {
    try {
      const json = JSON.parse(this.gardenMapJSON);
      const objects = json.objects;

      this.canvas = document.getElementById('gardenMap') as HTMLCanvasElement;

      if (this.canvas) {
        this.ctx = this.canvas.getContext('2d');

        if (this.ctx) {
          for (let i = 0; i < objects.length; i++) {
            const object = objects[i];

            if (object.type === 'rect') {
              this.ctx.fillStyle = object.bgColor;
              this.ctx.fillRect(object.px, object.py, object.w, object.h);
            } else {
              this.ctx.beginPath();
              this.ctx.arc(object.x, object.y, object.radius, 0, 2 * Math.PI);
              this.ctx.fillStyle = object.bgColor;
              this.ctx.fill();
            }
          }
        }
      }

      this.isMapLoaded = true;
    } catch {
      this.toast.error('Došlo je do greške pri učitavanju mape bašte!');
    }
  }

  clearGardenMap() {
    if (this.canvas && this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.gardenMapJSON = '';
      this.isMapLoaded = false;
    }
  }

  sendRequest() {
    if (this.selectedServices.length === 0) {
      this.toast.error('Morate izaberiti bar jednu uslugu!');
      return;
    }

    const date = this.initialFormGroup.get('date')?.value;
    const gardenArea = this.initialFormGroup.get('gardenArea')?.value;

    const vacationStart = this.companyData.vacationPeriod.start;
    const vacationEnd = this.companyData.vacationPeriod.end;

    if (date >= vacationStart && date <= vacationEnd) {
      this.toast.error(
        'Firma ne može realizovati radove za izabrani dan jer je na odmoru!'
      );
      return;
    }

    if (this.gardenType === 'P') {
      const furnitureArea = this.privateFormGroup.get('furnitureArea')?.value;
      const poolArea = this.privateFormGroup.get('poolArea')?.value;
      const greenArea = this.privateFormGroup.get('greenArea')?.value;

      if (gardenArea != poolArea + greenArea + furnitureArea) {
        this.toast.error('Niste uneli pravilnu meru površina bašte!');
        return;
      }
    } else {
      const fountainArea = this.restaurantFormGroup.get('fountainArea')?.value;
      const greenArea = this.restaurantFormGroup.get('greenArea')?.value;

      if (gardenArea != fountainArea + greenArea) {
        this.toast.error('Niste uneli pravilnu meru površina bašte!');
        return;
      }
    }

    this.dataService
      .getAvailabilityOfWorkers(this.companyData._id, date)
      .subscribe((result) => {
        const isAnyWorkerAvailable = result['data'];

        if (!isAnyWorkerAvailable) {
          this.toast.error(
            'Trenutno nema radnika za dati termin! Izaberite drugi termin'
          );
        } else {
          const greenArea = this.privateFormGroup.get('greenArea')?.value;

          if (this.gardenType == 'P') {
            const furnitureArea =
              this.privateFormGroup.get('furnitureArea')?.value;
            const poolArea = this.privateFormGroup.get('poolArea')?.value;

            this.dataService
              .sendRequest(
                this.ownerData._id,
                this.companyData._id,
                this.gardenType,
                gardenArea,
                greenArea,
                this.selectService,
                new Date(),
                date,
                date,
                poolArea,
                undefined,
                furnitureArea,
                undefined
              )
              .subscribe((result) => {
                if (result['status'] == 'ok') {
                  this.toast.success(
                    'Uspešno ste poslali zahtev za dekorisanje bašte'
                  );
                  this.router.navigate(['/']);
                } else {
                  this.toast.error('Došlo je do greške pri čuvanju zahteva');
                  console.error(result['message']);
                }
              });
          } else {
            const fountainArea =
              this.restaurantFormGroup.get('fountainArea')?.value;
            const furnitureNumber =
              this.privateFormGroup.get('furnitureNumber')?.value;

            this.dataService
              .sendRequest(
                this.ownerData._id,
                this.companyData._id,
                this.gardenType,
                gardenArea,
                greenArea,
                this.selectService,
                new Date(),
                date,
                date,
                undefined,
                fountainArea,
                undefined,
                furnitureNumber
              )
              .subscribe((result) => {
                if (result['status'] == 'ok') {
                  this.toast.success(
                    'Uspešno ste poslali zahtev za dekorisanje bašte'
                  );
                  this.router.navigate(['/']);
                } else {
                  this.toast.error('Došlo je do greške pri čuvanju zahteva');
                  console.error(result['message']);
                }
              });
          }
        }
      });
  }
}
