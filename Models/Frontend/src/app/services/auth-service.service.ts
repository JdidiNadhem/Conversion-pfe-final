import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { User } from "../Models/user";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

const baseUrl = "http://localhost:5000/api/";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};
@Injectable({
  providedIn: "root",
})
export class AuthServiceService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private loggedIn = new BehaviorSubject<boolean>(false);
  jwt: string;
  role;
  isadmin: boolean;
  isLoggedInUser;
  isLogin: boolean;
  constructor(public http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }
  public get currentUserValue(): User {
    return JSON.parse(localStorage.getItem("currentUser"));
  }

  loginUser(login: string, motdepasse: string) {
    return this.http
      .post<any>(baseUrl + "user/login", { login, motdepasse }, httpOptions)
      .pipe(
        map((user) => {
          console.log(user);
          // login successful if there's a jwt token in the response
          if (user && user.token) {
            localStorage.setItem("token", user.token);
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem("currentUser", JSON.stringify(user["User"]));
            localStorage.setItem("Role", JSON.stringify(user["Role"]));
            localStorage.setItem("IsLoggedIn", JSON.stringify(true));
            this.isLoggedInUser = JSON.parse(
              localStorage.getItem("IsLoggedIn")
            );
            this.currentUserSubject.next(user["User"]);
            this.loggedIn.next(true);
          }

          return user;
        })
      );
  }

  registerUser(
    nom: string,
    prenom: string,
    email: string,
    login: string,
    motdepasse: string
  ): Observable<any> {
    return this.http.post(
      baseUrl + "user/register",
      {
        nom,
        prenom,
        email,
        login,
        motdepasse,
      },
      httpOptions
    );
  }

  saveToken(jwt: string) {
    localStorage.setItem("token", jwt);
    this.jwt = jwt;
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("Role");
    localStorage.removeItem("IsLoggedIn");

    this.isLogin = false;
  }

  isAdmin(): boolean {
    this.role = JSON.parse(localStorage.getItem("Role"));
    this.isadmin = false;
    if (this.role == "ADMIN") {
      this.isadmin = true;
    }

    return this.isadmin;
  }
  isLoggedIn(): boolean {
    this.isLoggedInUser = JSON.parse(localStorage.getItem("IsLoggedIn"));
    this.isLogin = false;
    if (this.isLoggedInUser == true) {
      this.isLogin = true;
    }
    console.log("logged in ", this.isLogin);
    return this.isLogin;
  }
}
