import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
const baseUrl = "http://localhost:5000/api/";
@Injectable({
  providedIn: "root",
})
export class ConversionService {
  constructor(private http: HttpClient) {}

  uploadFile(e) {
    let headers = new HttpHeaders({
      authorization: localStorage.getItem("token"),
    });
    console.log("token ===   ", localStorage.getItem("token"));
    console.log("headers ===   ", headers);
    return this.http.post(baseUrl + "user/upload", e, { headers: headers });
  }
  convertFile(filePath) {
    let headers = new HttpHeaders({
      authorization: localStorage.getItem("token"),
    });

    return this.http.post(baseUrl + "user/conversion", filePath, {
      headers: headers,
    });
  }
  downloadFile(path) {
    let headers = new HttpHeaders({
      authorization: localStorage.getItem("token"),
    });

    return this.http.post(baseUrl + "user/download_jrxml", path, {
      headers: headers,
    });
  }
  getConversions() {
    let headers = new HttpHeaders({
      authorization: localStorage.getItem("token"),
    });

    return this.http.get(baseUrl + "user/get_conversions", {
      headers: headers,
    });
  }
}
