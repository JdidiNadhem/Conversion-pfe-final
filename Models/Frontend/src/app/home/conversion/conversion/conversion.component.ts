import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConversionService } from "src/app/services/conversion.service";

@Component({
  selector: "app-conversion",
  templateUrl: "./conversion.component.html",
  styleUrls: ["./conversion.component.css"],
})
export class ConversionComponent implements OnInit {
  formCompte: FormGroup;
  attachment: any;
  submittedFormProfile = false;
  path: any;
  data;

  constructor(
    private formBuilder: FormBuilder,
    private convService: ConversionService
  ) {}

  ngOnInit() {
    this.formCompte = this.formBuilder.group({
      attachment: ["", Validators.required],
    });
    this.getConversions();
  }

  getConversions() {
    this.convService.getConversions().subscribe((res) => {
      this.data = res;
      console.log("data est ", this.data);
    });
  }

  onSelectedFile(event) {
    this.attachment = event.target.files[0];
    console.log("selected file", this.attachment.name);
  }
  onSubmitFile() {
    this.submittedFormProfile = true;

    // stop here if form is invalid
    if (this.formCompte.invalid) {
      return;
    }
    console.log(this.formCompte.value);
    const form = this.formCompte.value;
    const formData = new FormData();
    formData.append("file", this.attachment, this.attachment.name);
    this.convService.uploadFile(formData).subscribe(
      (res: any) => {
        this.convService.convertFile({ path: res.path }).subscribe(
          (resconv: any) => {
            console.log("converted file est", resconv.jrxmlPath);
            localStorage.setItem("pathFile", JSON.stringify(resconv.jrxmlPath));
            console.log("path local storage", localStorage.getItem("pathFile"));
          },
          (error) => {
            console.log(error);
          }
        );

        console.log("le path du fichier est ", res.path);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  DownloadFile() {
    this.path = localStorage.getItem("pathFile");
    console.log("path file to download", this.path);
    this.convService.downloadFile(this.path).subscribe((file) => {
      console.log("response file download", file);
    });
  }
}
