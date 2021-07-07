import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthServiceService } from "src/app/services/auth-service.service";
import swal from "sweetalert2";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  test: Date = new Date();
  focus;
  focus1;
  focus2;
  focus3;
  focus4;
  registerForm: FormGroup;
  error = "";
  constructor(
    private fb: FormBuilder,
    private router: Router,
    public authService: AuthServiceService
  ) {
    this.loadForm();
  }
  loadForm() {
    this.registerForm = this.fb.group({
      nom: ["", Validators.required],
      prenom: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      login: ["", Validators.required],
      password: ["", Validators.required],
    });
  }
  get f() {
    return this.registerForm.controls;
  }
  registerData() {
    this.authService
      .registerUser(
        this.f.nom.value,
        this.f.prenom.value,
        this.f.email.value,
        this.f.login.value,
        this.f.password.value
      )
      .subscribe(
        (res) => {
          swal(
            "",
            "votre inscription a été enregistrée avec succès.Merci de se connecter",
            "success"
          );
          // this.snackBar.open(res.message, 'Dismiss', { duration: 3000 });
          this.router.navigate(["/login"]);
        },
        (error) => {
          this.error = error;
          swal("", error, "error");
        }
      );
  }

  ngOnInit() {}
}
