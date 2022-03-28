import { Component, OnInit } from '@angular/core';
import { UserLogin } from 'src/app/models/auth';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'ua-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  signedIn: boolean = false;
  authToken;

  constructor(public auth: AuthService) {}

  ngOnInit(): void {

  }

  logOut() {
    this.signedIn = false;
    this.auth.clearUser();
  }
}
