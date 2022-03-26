import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ua-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  signedIn: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
