import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { config } from "../config";

import { User } from "../Models";
const baseUrl = "http://localhost:5000/api/";
@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private http: HttpClient) {}

  getAllUsers() {
    let headers = new HttpHeaders({
      authorization: localStorage.getItem("currentUser"),
    });
    return this.http.get<any[]>(baseUrl + "get_users/");
  }
  getUserCurrent() {
    let headers = new HttpHeaders({
      authorization: localStorage.getItem("token"),
    });
    return this.http.get<any>(baseUrl + "user/current", {
      headers: headers,
    });
  }

  updateUserInfo(id, nom, prenom, email, login, motdepasse) {
    let headers = new HttpHeaders({
      authorization: localStorage.getItem("token"),
    });
    return this.http.put(
      baseUrl + "user/update_user/" + id,
      { nom, prenom, email, login, motdepasse },
      {
        headers: headers,
      }
    );
  }

  updateUserPassword(id, motdepasse, nouveaumotdepasse) {
    let headers = new HttpHeaders({
      authorization: localStorage.getItem("token"),
    });
    return this.http.put(
      baseUrl + "user/update_user_password/" + id,
      { motdepasse, nouveaumotdepasse },
      {
        headers: headers,
      }
    );
  }
  delete(id) {
    let headers = new HttpHeaders({
      authorization: localStorage.getItem("token"),
    });
    this.http.delete(baseUrl + "delete_user/:id" + id);
  }
}
