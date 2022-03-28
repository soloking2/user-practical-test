import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ua-loading-table',
  templateUrl: './loading-table.component.html',
  styleUrls: ['./loading-table.component.scss'],
})
export class LoadingTableComponent implements OnInit {
  @Input() loading!: boolean;
  constructor() {}

  ngOnInit(): void {}
}
