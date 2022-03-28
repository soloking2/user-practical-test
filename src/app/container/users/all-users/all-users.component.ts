import { TitleCasePipe } from '@angular/common';
import { AfterViewInit, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { Action, HeaderData, User, UserLocation } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { MessagesService } from 'src/app/shared/messages.service';
import { UsersService } from '../users.service';

@Component({
  selector: 'ua-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss'],
})
export class AllUsersComponent implements OnInit, OnDestroy, AfterViewInit {
  datas: User[] = [] as User[];
  page: number = 1;
  total: number = 0;
  totalPages: number = 0;
  limit: number = 6;
  loading: boolean = false;
  pageSub!: Subscription;
  lat: number = 0;
  lng: number = 0;

  private subscription: Subscription;

  public dateNow = new Date();
  public dDay = new Date(this.dateNow.getTime() + this.auth.remainingTime *1000);
  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute = 60;

  public timeDifference;
  public secondsToDday;
  public minutesToDday;
  public hoursToDday;
  public daysToDday;
  userLocation!: string;

  headerData: HeaderData[] = [
    {
      value: '_id',
      viewValue: 'S/N',
    },
    {
      value: 'email',
      viewValue: 'Email',
    },
    {
      value: 'first_name',
      viewValue: 'First Name',
    },
    {
      value: 'last_name',
      viewValue: 'Last Name',
    },
  ];
  action: Action = {
    value: [
      { viewValue: 'Edit', value: 'id' },
      { viewValue: 'Delete', value: 'id' },
    ],
    id: 'id',
  };

  constructor(
    public users: UsersService,
    private titleCase: TitleCasePipe,
    private router: Router,
    private auth: AuthService,
    private zone: NgZone
  ) {}

  ngOnInit(): void {

     this.subscription = interval(1000).subscribe((x) => {
       this.getTimeDifference();
     });

    this.pageSub = this.users.getPage.subscribe((page) => {
      this.page = page;
    });
    this.getUsers(this.page);
    this.getLocation();
  }

  ngAfterViewInit(): void {}

  onPage(page: number) {
    if (page <= this.totalPages) {
      this.page = page;
      this.users.setPage(this.page);
      this.getUsers(this.page);
    }
  }
  onPrev() {
    if (this.page > 1) {
      this.page--;
      this.users.setPage(this.page);
      this.getUsers(this.page);
    }
  }
  onNext() {
    if (this.page < this.totalPages) {
      this.page++;
      this.users.setPage(this.page);
      this.getUsers(this.page);
    }
  }

  getUsers(page: number) {
    this.loading = true;
    this.users.getUsers(page).subscribe((res) => {
      this.total = res.total;
      this.totalPages = res.total_pages;
      this.limit = res.per_page;
      this.loading = false;
      this.mapTableData(res.data);
    });
  }

  transformString(value: string): string {
    return this.titleCase.transform(value);
  }

  findTableNumber(index: number): number {
    return index + 1 + (this.page - 1) * this.limit;
  }

  private mapTableData(data: User[]) {
    this.datas = data.map((user, index) => {
      let tableDetail: User = {
        id: user.id,
        email: user.email,
        first_name: this.transformString(user.first_name),
        last_name: this.transformString(user.last_name),
        _id: this.findTableNumber(index),
      };
      return tableDetail;
    });
  }

  fetchSelected(event: { id: number; viewValue: string }) {
    switch (event.viewValue) {
      case 'Edit':
        this.router.navigate(['/users/edit-user', event.id]);
        break;

      case 'Delete':
        this.users.initiateDelete(event.id);
        this.datas = this.datas.filter((user) => user.id !== event.id);
        break;

      default:
        break;
    }
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.zone.run(() => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.displayLocation(lat, lng);
        });
      }, this.showError);
    }
  }

  showError(error) {
    if (error.PERMISSION_DENIED) {
      console.log(error);
    }
  }

  displayLocation(lat, lng) {
    this.lat = lat;
    this.lng = lng;
    this.users.getUserCountry(this.lat, this.lng).subscribe((res: any) => {
      
      this.userLocation = res.results[0].components.country
    });
  }

  private getTimeDifference() {
    this.timeDifference = this.dDay.getTime() - new Date().getTime();
    this.allocateTimeUnits(this.timeDifference);
  }

  private allocateTimeUnits(timeDifference) {
    this.secondsToDday = Math.floor(
      (timeDifference / this.milliSecondsInASecond) % this.SecondsInAMinute
    );
    this.minutesToDday = Math.floor(
      (timeDifference / (this.milliSecondsInASecond * this.minutesInAnHour)) %
        this.SecondsInAMinute
    );
    this.hoursToDday = Math.floor(
      (timeDifference /
        (this.milliSecondsInASecond *
          this.minutesInAnHour *
          this.SecondsInAMinute)) %
        this.hoursInADay
    );
    this.daysToDday = Math.floor(
      timeDifference /
        (this.milliSecondsInASecond *
          this.minutesInAnHour *
          this.SecondsInAMinute *
          this.hoursInADay)
    );
  }

  ngOnDestroy(): void {
    if (this.pageSub) {
      this.pageSub.unsubscribe();
    }
    this.subscription.unsubscribe();
  }
}
