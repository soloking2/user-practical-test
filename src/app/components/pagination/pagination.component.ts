import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ua-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() page: number = 0;
  @Input() limit: number = 0;
  @Input() total: number = 0;
  @Output() prevEvent = new EventEmitter<null>();
  @Output() nextEvent = new EventEmitter<null>();
  @Output() pageEvent = new EventEmitter<number>();
  totalPages: number = 0;
  pageWindows: number = 5;
  maxLeft: number = 0;
  maxRight: number = 0;
  windowArray: number[] = [] as number[];
  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.getPaginationInfo();
  }

  onPrev(): void {
    this.prevEvent.emit();
  }

  onNext(): void {
    this.nextEvent.emit();
  }

  onPage(pageNumber: number): void {
    this.pageEvent.emit(pageNumber);
  }

  getPaginationInfo(): void {
    //maxLeft represents the leftmost number maxRight vice-versa
    this.totalPages = Math.ceil(this.total / this.limit);
    this.maxLeft = this.page - Math.floor(this.pageWindows / 2);
    this.maxRight = this.page + Math.floor(this.pageWindows / 2);
    this.windowArray = new Array(this.maxRight - (this.maxLeft - 1));

    //WindowArray specifies the length of numbers that shows
    if (this.maxLeft < 1) {
      this.maxLeft = 1;
      this.maxRight = this.pageWindows;
      this.windowArray = new Array(this.maxRight - (this.maxLeft - 1));
    }

    if (this.maxRight > this.totalPages) {
      this.maxLeft = this.totalPages - (this.pageWindows - 1);

      if (this.maxLeft < 1) {
        this.maxLeft = 1;
      }
      this.maxRight = this.totalPages;
      this.windowArray = new Array(this.maxRight - (this.maxLeft - 1));
    }
  }
}
