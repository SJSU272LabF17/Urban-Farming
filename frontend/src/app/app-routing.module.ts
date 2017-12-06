import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { AuthGuard } from './services/authGuard.service';

import { LandingComponent }   from './components/landing/landing.component';
import { HowItWorksComponent } from "./components/how-it-works/how-it-works.component";
import { AboutUsComponent } from "./components/about-us/about-us.component";
import { ContactUsComponent } from "./components/contact-us/contact-us.component";
import { MyFarmsComponent } from "./components/my-farms/my-farms.component";
import { ProposalsComponent } from "./components/proposals/proposals.component";

const appRoutes: Routes = [
  { path: '', component: LandingComponent, pathMatch: 'full' },
  { path: 'my-farms', component: MyFarmsComponent, canActivate: [AuthGuard], data: { role: 'OWNER' } },
  { path: 'proposals', component: ProposalsComponent, canActivate: [AuthGuard], data: { role: 'FARMER' } },
  { path: 'how-it-works', component: HowItWorksComponent },
  { path: 'aboutus', component: AboutUsComponent },
  { path: 'contactus', component: ContactUsComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
