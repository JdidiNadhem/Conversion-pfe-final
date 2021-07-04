import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import {
  ModalDismissReasons,
  NgbDate,
  NgbModal,
} from "@ng-bootstrap/ng-bootstrap";
import { MustMatch } from "../auth/helpers/must-match.validator";
import { AuthServiceService, UserService } from "../services";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  currentUser;
  focus;
  focus1;
  focus2;
  focus3;
  focus4;
  registerForm: FormGroup;
  error = "";
  closeResult: string;
  model1: NgbDate;
  model2: NgbDate;
  submitted = false;
  passwordForm: FormGroup;
  loading = false;
  msg = "password";

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private modalService: NgbModal
  ) {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    console.log(this.currentUser);
    this.loadForm();
    this.checkPassword();
  }

  ngOnInit() {}
  loadForm() {
    this.registerForm = this.fb.group({
      nom: [this.currentUser.nom, Validators.required],
      prenom: [this.currentUser.prenom, Validators.required],
      email: [this.currentUser.email, [Validators.required, Validators.email]],
      login: [this.currentUser.login, Validators.required],
    });
  }

  saveData() {
    const form = this.registerForm.value;

    if (form.nom == "" || form.nom == null) {
      form.nom = this.currentUser.nom;
      console.log("nom est ", form.nom);
    }
    console.log("nom est ", form.nom);
    if (form.prenom == "" || form.prenom == null) {
      form.prenom = this.currentUser.prenom;
      console.log("prenom est ", form.prenom);
    }
    console.log("prenom est ", form.prenom);
    if (form.email == "" || form.email == null) {
      form.email = this.currentUser.email;
      console.log("email est ", form.email);
    }
    console.log("email est ", form.email);
    if (form.login == "" || form.login == null) {
      form.login = this.currentUser.login;
      console.log("login est ", form.login);
    }
    console.log("login est ", form.login);
    console.log("current user", this.currentUser);

    this.userService
      .updateUserInfo(
        this.currentUser.id,
        form.nom,
        form.prenom,
        form.email,
        form.login,
        this.currentUser.motdepasse
      )
      .subscribe(
        (info) => {
          this.userService.getUserCurrent().subscribe(
            (res) => {
              console.log(" info user", res);
              localStorage.setItem("currentUser", JSON.stringify(res["User"]));
            },
            (error) => {
              this.error = error;
            }
          );

          // this.snackBar.open(res.message, 'Dismiss', { duration: 3000 });
          this.router.navigate(["/user-profile"]);
        },
        (error) => {
          this.error = error;
        }
      );
  }
  get f() {
    return this.passwordForm.controls;
  }
  checkPassword() {
    this.passwordForm = this.fb.group(
      {
        oldpassword: ["", Validators.required],
        newpassword: ["", [Validators.required, Validators.minLength(6)]],
        cpassword: ["", Validators.required],
      },
      {
        validator: MustMatch("newpassword", "cpassword"),
      }
    );
  }
  onSubmitPassword() {
    this.submitted = true;
    this.loading = true;
    console.log(
      "current user",
      this.currentUser.id,
      this.currentUser.motdepasse,
      this.f.oldpassword.value
    );
    // stop here if form is invalid
    if (this.passwordForm.invalid) {
      return;
    }

    this.userService
      .updateUserPassword(
        this.currentUser.id,
        this.f.oldpassword.value,
        this.f.newpassword.value
      )
      .subscribe(
        (res) => {
          this.userService.getUserCurrent().subscribe(
            (user) => {
              console.log(user);
              localStorage.setItem("currentUser", JSON.stringify(user["User"]));
              window.location.reload();
            },
            (error) => {}
          );
        },
        (error) => {
          this.error = "Vérifier votre ancien mot de passe";
        }
      );
  }

  open(content, type, modalDimension) {
    if (modalDimension === "sm" && type === "modal_mini") {
      this.modalService
        .open(content, {
          windowClass: "modal-mini",
          size: "sm",
          centered: true,
        })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    } else if (modalDimension === "" && type === "Notification") {
      this.modalService
        .open(content, { windowClass: "modal-danger", centered: true })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    } else {
      this.modalService.open(content, { centered: true }).result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
    }
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
}
