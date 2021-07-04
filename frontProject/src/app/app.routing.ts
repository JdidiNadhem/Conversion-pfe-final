import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "./home/home.component";
import { ProfileComponent } from "./profile/profile.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { LandingComponent } from "./landing/landing.component";
import { LoginComponent } from "./auth/login/login.component";
import { ConversionComponent } from "./home/conversion/conversion/conversion.component";
import { HistoriqueComponent } from "./home/historique/historique/historique.component";
import { ConfigurationComponent } from "./home/configuration/configuration/configuration.component";
import { HistoriqueAdminComponent } from "./home/historique/historique-admin/historique-admin/historique-admin.component";

const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "user-profile", component: ProfileComponent },
  { path: "register", component: SignupComponent },
  { path: "landing", component: LandingComponent },
  { path: "login", component: LoginComponent },
  { path: "conversion", component: ConversionComponent },
  { path: "conversion-admin", component: HistoriqueAdminComponent },
  { path: "historique", component: HistoriqueComponent },
  { path: "configuration", component: ConfigurationComponent },
  { path: "", redirectTo: "home", pathMatch: "full" },
  // { path: "**", redirectTo: "login" },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true,
    }),
  ],
  exports: [],
})
export class AppRoutingModule {}
