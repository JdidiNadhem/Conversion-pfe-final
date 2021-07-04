import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd, NavigationStart } from "@angular/router";
import { Location, PopStateEvent } from "@angular/common";
import { AuthServiceService } from "src/app/services";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  public isCollapsed = true;
  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];
  focus;
  isadmin: boolean;
  isLoggedIn: boolean;

  constructor(
    public location: Location,
    private router: Router,
    private authService: AuthServiceService
  ) {
    this.isadmin = this.authService.isAdmin();
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
      if (event instanceof NavigationStart) {
        if (event.url != this.lastPoppedUrl)
          this.yScrollStack.push(window.scrollY);
      } else if (event instanceof NavigationEnd) {
        if (event.url == this.lastPoppedUrl) {
          this.lastPoppedUrl = undefined;
          window.scrollTo(0, this.yScrollStack.pop());
        } else window.scrollTo(0, 0);
      }
    });
    this.location.subscribe((ev: PopStateEvent) => {
      this.lastPoppedUrl = ev.url;
    });
  }

  isHome() {
    var titlee = this.location.prepareExternalUrl(this.location.path());

    if (titlee === "#/home") {
      return true;
    } else {
      return false;
    }
  }
  isDocumentation() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee === "#/documentation") {
      return true;
    } else {
      return false;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/login"]).then(() => {
      window.location.reload();
    });
  }
}
