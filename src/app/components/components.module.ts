import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table/table.component';
import { EmptyComponent } from './empty/empty.component';
import { LoadingTableComponent } from './loading-table/loading-table.component';
import { PaginationComponent } from './pagination/pagination.component';
import { SuccessMessageComponent } from './success-message/success-message.component';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';

const sharedFiles = [
  TableComponent,
  TableComponent,
  EmptyComponent,
  LoadingTableComponent,
  PaginationComponent,
  SuccessMessageComponent,
  NavbarComponent,
];

@NgModule({
  declarations: sharedFiles,
  imports: [CommonModule, RouterModule],
  exports: sharedFiles,
})
export class ComponentsModule {}
