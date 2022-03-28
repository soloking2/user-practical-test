import { Component, OnInit } from '@angular/core';
import { UserLogin } from 'src/app/models/auth';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'ua-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  signedIn: boolean = false;

  constructor(public auth: AuthService) {
    const authToken = JSON.parse(localStorage.getItem('user')) as UserLogin || {};
    if (authToken != null) {
      this.signedIn = true
    } else {
      this.signedIn = false;
    }
   }

  ngOnInit(): void {

  }

  logOut() {
    this.signedIn = false;
    this.auth.clearUser();
  }

}
