import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { AuthGuard } from './services/authGuard.service';

import { LandingComponent }   from './components/landing/landing.component';
import { HowItWorksComponent } from "./components/how-it-works/how-it-works.component";
import { AboutUsComponent } from "./components/about-us/about-us.component";
import { ContactUsComponent } from "./components/contact-us/contact-us.component";
import { MyFarmsComponent } from "./components/my-farms/my-farms.component";
import { MyProposalsComponent } from "./components/my-proposals/my-proposals.component";
import { ProposalComponent } from "./components/proposal/proposal.component";
import {ForumsComponent} from "./components/forums/forums.component";
import {ForumDetailsComponent} from "./components/forum-details/forum-details.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {EditProfileComponent} from "./components/edit-profile/edit-profile.component";

const appRoutes: Routes = [
  { path: '', component: LandingComponent, pathMatch: 'full' },
  { path: 'my-farms', component: MyFarmsComponent, canActivate: [AuthGuard], data: { role: 'OWNER' } },
  { path: 'my-proposals', component: MyProposalsComponent, canActivate: [AuthGuard], data: { role: 'FARMER' } },
  { path: 'proposal/:id', component: ProposalComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'edit-profile', component: EditProfileComponent, canActivate: [AuthGuard] },
  { path: 'forums', component: ForumsComponent },
  { path: 'forums/:id', component: ForumDetailsComponent },
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
