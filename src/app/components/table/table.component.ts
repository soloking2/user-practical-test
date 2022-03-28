import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Action, HeaderData } from 'src/app/models/user';

@Component({
  selector: 'ua-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() datas: any[] = [];
  @Input() headers: HeaderData[] = [];
  @Input() action: Action = {
    value: [
      {
        viewValue: '',
        value: '',
      },
    ],
    id: '',
  };

  @Output() onSelect = new EventEmitter<Event>();
  @Output() actionSelect = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  onSelection(row) {
    this.onSelect.emit(row);
  }

  actionSelected(id: number, viewValue: string) {
    this.actionSelect.emit({id, viewValue});
  }
}
