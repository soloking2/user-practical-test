import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ua-empty',
  templateUrl: './empty.component.html',
  styleUrls: ['./empty.component.scss'],
})
export class EmptyComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() loading: boolean;
  constructor() {}

  ngOnInit(): void {}
}
