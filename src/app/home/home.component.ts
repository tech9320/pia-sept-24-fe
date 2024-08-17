import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(
    private toastr: ToastrService,
    private dataService: DataService
  ) {}

  isUser: boolean = true;

  ngOnInit(): void {
    this.dataService.getWorkerCount().subscribe((result) => {
      this.workerCount = result.data;
    });

    this.dataService.getOwnerCount().subscribe((result) => {
      this.ownerCount = result.data;
    });
  }

  showInfo(message: string) {
    this.toastr.info(message);
  }

  isLoggedIn(): boolean {
    if (sessionStorage.getItem('user_type')) {
      return true;
    }

    return false;
  }

  logoutUser() {
    sessionStorage.removeItem('user_type');
    sessionStorage.removeItem('user_data');

    this.toastr.success('Uspešno ste se odjavili');
  }

  workerCount = 0;
  ownerCount = 0;

  availableTimes = [
    { displayValue: '24 sata', actualValue: 1 },
    { displayValue: '7 data', actualValue: 7 },
    { displayValue: '30 dana', actualValue: 30 },
  ];

  selectedTime: string = this.availableTimes[0].displayValue;

  contractCount: number = this.availableTimes[0].actualValue;

  updateContactCount(event: Event): void {
    // const selectedElement = event.target as HTMLSelectElement;
    // const selectedDisplayValue = selectedElement.value;
    // const selectedValue = this.availableTimes.find(
    //   (time) => time.displayValue == selectedDisplayValue
    // );
    // if (selectedValue) {
    //   let result = selectedValue?.actualValue * 10;
    //   this.showInfo(result.toString());
    // }
  }
}
