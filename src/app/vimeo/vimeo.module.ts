import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VimeoComponent } from './vimeo.component';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {VimeoUploadService} from './services/vimeo-upload.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  declarations: [VimeoComponent],
  exports: [VimeoComponent],
  providers: [VimeoUploadService]
})
export class VimeoModule { }
