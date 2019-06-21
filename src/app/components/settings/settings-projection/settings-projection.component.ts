import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { ProjectorService } from '../../../services/projector.service';
import { ipcRenderer } from 'electron';

import { SettingsJSONService } from '../../../services/settings-json.service';
import { ToastrService } from '../../../toastr/toastr.service';

@Component({
  selector: 'app-settings-projection',
  templateUrl: './settings-projection.component.html',
  styleUrls: ['./settings-projection.component.sass']
})
export class SettingsProjectionComponent implements OnInit {

  fonts: IFont[] = [
    { NAME: "Arial", FAMILY: "Arial, sans-serif" },
    { NAME: "Times New Roman", FAMILY: "Times New Roman, serif" },
    { NAME: "Courier New", FAMILY: "Courier New, monospaced" },
    { NAME: "Montserrat", FAMILY: "Montserrat, sans-serif" },
    { NAME: "Verdana", FAMILY: "Verdana, sans-serif" },
    { NAME: "Comic Sans MS", FAMILY: "Comic Sans MS, sans-serif" },
    { NAME: "Trebuchet MS", FAMILY: "Trebuchet MS, sans-serif" }
  ]

  fontSizeSelected: number = 14;
  fontSelected: string = "Montserrat, sans-serif";
  fontSizes: Array<number> = new Array<number>();
  textShadow: string = "none";
  hasFontShadow: boolean = false;


  startWithLogo = false;

  constructor(
    private activeModal: NgbActiveModal,
    private projector: ProjectorService,
    private settings: SettingsJSONService,
    private toast: ToastrService,
    private vcr: ViewContainerRef
  ) {
    toast.setRootViewContainerRef(vcr);
  }

  fontFamily() {
    ipcRenderer.send("projection-text-font", this.fontSelected);
    this.settings.save(SettingsJSONService.SETTINGS.PROJECAO.FONT.FAMILY, this.fontSelected)
  }

  fontSize() {
    this.projector.changeFontSize(this.fontSizeSelected);
    this.settings.save(SettingsJSONService.SETTINGS.PROJECAO.FONT.SIZE, this.fontSizeSelected)
  }

  startLogo() {
    this.settings.save(SettingsJSONService.SETTINGS.PROJECAO.INICIALIZAR.LOGO, this.startWithLogo);
  }

  fontShadow() {
    this.projector.hasFontShadow(this.hasFontShadow);
    this.settings.save(SettingsJSONService.SETTINGS.PROJECAO.FONT.SHADOW, this.hasFontShadow);
    if (this.hasFontShadow)
      this.textShadow = "5px 7px 10px #000";
    else
      this.textShadow = "none";

  }

  close() {
    this.activeModal.dismiss("Closed");
  }

  getSettings() {
    this.fontSizeSelected = this.settings.get(SettingsJSONService.SETTINGS.PROJECAO.FONT.SIZE);
    this.fontSelected = this.settings.get(SettingsJSONService.SETTINGS.PROJECAO.FONT.FAMILY);
    this.hasFontShadow = this.settings.get(SettingsJSONService.SETTINGS.PROJECAO.FONT.SHADOW);
    this.startWithLogo = this.settings.get(SettingsJSONService.SETTINGS.PROJECAO.INICIALIZAR.LOGO);
  }

  ngOnInit() {
    this.fonts.sort((a, b) => {
      if (a.NAME > b.NAME)
        return 1;
      else
        return 0;
    })

    for (var i = 2; i < 120; i *= 1.205) {
      var toPush = Math.ceil(i);
      this.fontSizes.push(toPush);
    }
    this.fontSizes.push(120);
    this.getSettings();
  }

}


interface IFont {
  NAME: string;
  FAMILY: string;
}
