import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { RouterModule } from "@angular/router";

import { HomeComponent } from "./home.component";

import { SectionsModule } from "../sections/sections.module";
import { ConversionComponent } from "./conversion/conversion/conversion.component";
import { HistoriqueComponent } from "./historique/historique/historique.component";
import { StatistiqueComponent } from "./statistique/statistique/statistique.component";
import { NouisliderModule } from "ng2-nouislider";
import { JwBootstrapSwitchNg2Module } from "jw-bootstrap-switch-ng2";
import { NgbdModalContent } from "../sections/modal/modal.component";
import { ConfigurationComponent } from "./configuration/configuration/configuration.component";
import { NgJsonEditorModule } from "ang-jsoneditor";

@NgModule({
  entryComponents: [NgbdModalContent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SectionsModule,
    NgbModule,
    NouisliderModule,
    NgJsonEditorModule,
    JwBootstrapSwitchNg2Module,
  ],
  declarations: [
    HomeComponent,
    ConversionComponent,
    HistoriqueComponent,
    StatistiqueComponent,
    ConfigurationComponent,
  ],
  exports: [HomeComponent],
  providers: [],
})
export class HomeModule {}
