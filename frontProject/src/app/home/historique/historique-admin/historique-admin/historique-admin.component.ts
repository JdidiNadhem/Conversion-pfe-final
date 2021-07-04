import { Component, OnInit } from "@angular/core";
import { ConversionService } from "src/app/services/conversion.service";

@Component({
  selector: "app-historique-admin",
  templateUrl: "./historique-admin.component.html",
  styleUrls: ["./historique-admin.component.css"],
})
export class HistoriqueAdminComponent implements OnInit {
  data;
  constructor(private convService: ConversionService) {}

  ngOnInit(): void {
    this.getConversionsUser();
  }

  getConversionsUser() {
    this.convService.getConversionsAdmin().subscribe((res) => {
      this.data = res["Conversions"];
      console.log("data en admin est ", this.data);
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
