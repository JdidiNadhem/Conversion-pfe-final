import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
const baseUrl = "http://localhost:5000/api/";
@Injectable({
  providedIn: "root",
})
export class ConfigurationService {
  constructor(private http: HttpClient) {}

  getAnalogieFile() {
    let headers = new HttpHeaders({
      authorization: localStorage.getItem("token"),
    });
    return this.http.get(baseUrl + "admin/get_analogie", { headers: headers });
  }

  configureAnalogieFile(configuration) {
    let headers = new HttpHeaders({
      authorization: localStorage.getItem("token"),
    });
    return this.http.post(baseUrl + "admin/configure", configuration, {
      headers: headers,
    });
  }
}
