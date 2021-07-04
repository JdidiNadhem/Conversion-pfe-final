import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthServiceService } from "src/app/services/auth-service.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  focus;
  focus1;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = "";
  constructor(
    private fb: FormBuilder,
    private router: Router,
    public authService: AuthServiceService,
    private route: ActivatedRoute
  ) {
    this.loadForm();
  }

  ngOnInit() {}
  loadForm() {
    this.loginForm = this.fb.group({
      login: ["", Validators.required],
      password: ["", Validators.required],
    });
  }
  get f() {
    return this.loginForm.controls;
  }
  loginData() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.authService
      .loginUser(this.f.login.value, this.f.password.value)
      .subscribe(
        (res) => {
          // if (res.code === 200) {

          //   localStorage.setItem("currentUser", JSON.stringify(res.result));
          this.router.navigate(["/home"]).then(() => {
            window.location.reload();
          });

          //  this.snackBar.open(res.message, 'Dismiss', { duration: 3000 });
          // } else {
          // this.snackBar.open(res.message, 'Dismiss', { duration: 3000 });
          //  return false;
          //}
        },
        (error) => {
          this.error = error;
          this.loading = false;
        }
      );
  }
}
