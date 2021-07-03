import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { JsonEditorComponent, JsonEditorOptions } from "ang-jsoneditor";
import { ConfigurationService } from "src/app/services/configuration.service";
import { schema } from "../schema.value";

@Component({
  selector: "app-configuration",
  templateUrl: "./configuration.component.html",
  styleUrls: ["./configuration.component.css"],
})
export class ConfigurationComponent implements OnInit {
  @ViewChild(JsonEditorComponent) editor: JsonEditorComponent;

  options = new JsonEditorOptions();
  data;
  form: FormGroup;
  chang: any;
  constructor(
    private confService: ConfigurationService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.options.mode = "code";
    this.options.modes = ["code", "text", "view"];
    this.options.schema = schema;
    this.options.statusBar = false;
    this.options.onChange = () => console.log(this.editor.get());
  }

  ngOnInit(): void {
    this.getAnalogie();
    this.form = this.fb.group({
      myinput: [this.data],
    });
  }

  getAnalogie() {
    this.confService.getAnalogieFile().subscribe(
      (res: any) => {
        this.data = res["Analogie"];
      },
      (error) => {
        console.log(error);
      }
    );
  }
  onSubmitJson() {
    console.log("finalchange===   ", this.editor.get());
    this.chang = this.editor.get();
    console.log("=========================   ", this.chang);
    this.confService
      .configureAnalogieFile({ configuration: this.chang })
      .subscribe(
        (resconf: any) => {
          console.log("contenu configure", resconf);
          this.router.navigate(["/configuration"]);
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
