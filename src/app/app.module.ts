import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import {VimeoModule} from './vimeo/vimeo.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    VimeoModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
