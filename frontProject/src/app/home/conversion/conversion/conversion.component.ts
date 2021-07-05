import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConversionService } from "src/app/services/conversion.service";
import swal from "sweetalert2";

@Component({
  selector: "app-conversion",
  templateUrl: "./conversion.component.html",
  styleUrls: ["./conversion.component.css"],
})
export class ConversionComponent implements OnInit {
  formCompte: FormGroup;
  attachment: any;
  submittedFormProfile = false;
  nameFile: any;
  data;
  error;

  constructor(
    private formBuilder: FormBuilder,
    private convService: ConversionService
  ) {}

  ngOnInit() {
    this.formCompte = this.formBuilder.group({
      attachment: ["", Validators.required],
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
      swal("", "ajouter un fichier xml ", "warning");
      return;
    }
    if (this.attachment.type.toString() !== "text/xml") {
      this.error = "Veuillez importer un fichier xml !";
      swal("", this.error, "error");

      return;
    }
    console.log(this.formCompte.value);
    const form = this.formCompte.value;
    const formData = new FormData();
    formData.append("file", this.attachment, this.attachment.name);
    this.convService.uploadFile(formData).subscribe(
      (res: any) => {
        this.error = "";

        this.convService.convertFile({ path: res.path }).subscribe(
          (resconv: any) => {
            this.error = "";
            console.log("converted file est", resconv);
            localStorage.setItem("fileName", JSON.stringify(resconv.filename));
            swal("", "Le fichier est ajouté avec succès", "success");
          },
          (error) => {
            console.log(error);
            this.error = error;
            swal("", this.error, "error");
          }
        );
      },
      (error) => {
        console.log(error);
        this.error = error;
        swal("", this.error, "error");
      }
    );
  }
  DownloadFile() {
    this.nameFile = JSON.parse(localStorage.getItem("fileName"));
    console.log("fileName file to download", this.nameFile);
    this.convService.downloadFile(this.nameFile).subscribe(
      (file) => {
        this.writeContents(file, this.nameFile, "text/jrxml"); // file extension

        swal("", "Le fichier est téléchargé avec succès", "success");
      },
      (error) => {
        swal("", error, "error");
      }
    );
  }

  writeContents(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }
}
