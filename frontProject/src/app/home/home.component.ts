import { Component, OnInit } from "@angular/core";
import { AuthServiceService } from "../services";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  model = {
    left: true,
    middle: false,
    right: false,
  };

  focus;
  focus1;
  isLoggedIn: boolean;

  constructor(private authService: AuthServiceService) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    console.log("home component", this.isLoggedIn);
  }
}
