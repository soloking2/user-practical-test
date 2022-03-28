import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ua-success-message',
  templateUrl: './success-message.component.html',
  styleUrls: ['./success-message.component.scss'],
})
export class SuccessMessageComponent implements OnInit {
  @Input() message!: string;
  @Input() link!: string;
  @Input() directionMessage!: string;
  constructor() {}

  ngOnInit(): void {}
}
