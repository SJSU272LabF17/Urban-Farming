import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AgmCoreModule } from '@agm/core';

import { ModalModule } from './modal/modal.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HeaderComponent } from './components/header/header.component';
import { LandingComponent } from './components/landing/landing.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { FaqComponent } from './components/faq/faq.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LandingComponent,
    AboutUsComponent,
    ContactUsComponent,
    FaqComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAaI2kPf5ry2flRY1Gu4Jbf2OyvtWBa9uE'
    }),
    ModalModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
