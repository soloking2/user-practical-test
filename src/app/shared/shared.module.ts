import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

const sharedFiles = [CommonModule, ReactiveFormsModule];


@NgModule({
  declarations: [],
  imports: sharedFiles,
  exports: sharedFiles
})
export class SharedModule { }
