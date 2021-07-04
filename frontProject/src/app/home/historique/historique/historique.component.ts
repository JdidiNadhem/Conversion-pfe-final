import { Component, OnInit } from "@angular/core";
import { ConversionService } from "src/app/services/conversion.service";

@Component({
  selector: "app-historique",
  templateUrl: "./historique.component.html",
  styleUrls: ["./historique.component.css"],
})
export class HistoriqueComponent implements OnInit {
  data;
  constructor(private convService: ConversionService) {}

  ngOnInit(): void {
    this.getConversionsUser();
  }

  getConversionsUser() {
    this.convService.getConversions().subscribe((res) => {
      this.data = res["Conversions"];
      console.log("data est ", this.data);
    });
  }
  downloadFile(fileName) {
    console.log("elements de row sont ==== ", fileName);
    this.convService.downloadFile(fileName).subscribe((file) => {
      this.writeContents(file, fileName, "text/jrxml"); // file extension
      console.log("response file download", file);
    });
  }

  writeContents(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }
}
