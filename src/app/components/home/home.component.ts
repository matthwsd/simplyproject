import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { IFile } from "../../interfaces/filesLst";
import { remote, screen } from 'electron';
import { ISlide } from '../../interfaces/slide';
import { Shortcuts } from '../../services/shortcuts/shortcuts.service';
import { PreviewService, SettingsJSONService, ProjectorService, FileService } from '../../services';

import * as path from 'path';
import * as url from 'url';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  textToShow: String = "";
  detailToShow: String = "";

  currentMedia: string = null;
  currentTime: number = 0;
  currentProgress: number = .1;
  currentVolume: number = 0;
  isPlaying: boolean = false;
  isPaused: boolean = true;
  isLooping: boolean = false;

  showVideo: boolean = true;
  showImage: boolean = false;


  API: HTMLVideoElement = null;
  IMG: HTMLImageElement = null;


  @ViewChild('videoPlayer') videoPlayer: any;
  @ViewChild('imageShow') imageShow: any;
  @ViewChild('position') position: any;
  @ViewChild('volume') volume: any;
  //Função para mudar o SRC do player
  onFileSelect(fileSelected: IFile) {
    if (fileSelected.type == "VIDEO")
      this.preview.setVideoSrc(fileSelected);
    else
      this.preview.setImageSrc(fileSelected);
  }

  //Função para mudar o SRC do player
  onFileSelectPlay(fileSelected: IFile) {
    this.preview.setVideoSrc(fileSelected, true);
  }

  onFileBackgroundSelect(fileSelected: IFile) {
    if (fileSelected.type == "IMAGE")
      this.preview.setImageSrc(fileSelected);
    else
      this.preview.setVideoSrcBackground(fileSelected);
  }

  onSlideChange(slide: ISlide) {
    this.preview.setText(slide.text, slide.detail);
    this.projector.setText(slide.text, slide.detail);
  }

  blackProjection() {
    this.preview.setBlackScreen()
    this.projector.setBlackScreen();
  }

  logoProjection() {
    var logoPath = this.files.getPathLogo();
    if (logoPath) {
      this.preview.setImageSrc(new IFile(logoPath));
    }
  }

  onBackSelectScreenProjection() {
    debugger;
    var backPath = this.files.getPathBack();
    if (backPath) {
      var file = new IFile(backPath);
      this.preview.setVideoSrcBackground(file);
    }
  }

  removeBackgroundProjection() {
    this.preview.setBackgroundBlack()
    this.projector.setBackgroundBlack();
  }

  clearPresentationProjection() {
    this.preview.clearText()
    this.projector.clearText();
  }

  private createProjector() {
    const BrowserWindow = remote.BrowserWindow;

    let snd = screen.getAllDisplays().find((display) => { return display.bounds.x !== 0 || display.bounds.y !== 0 });
    const sc = snd ? snd.workArea : screen.getPrimaryDisplay().workArea;
    console.log(screen.getAllDisplays());
    let projector = new BrowserWindow({
      width: sc.width,
      height: sc.height,
      x: sc.x,
      y: sc.y,
      frame: false,
      fullscreen: true,
      webPreferences: {
        webSecurity: false
      },
      title: "Simply - Projeção",
    })

    projector.loadURL(url.format({
      pathname: path.join(`${remote.app.getAppPath().replace(/\\/g, "/")}/dist/index.html`),
      protocol: 'file:',
      slashes: true
    }));

    // projector.loadURL('http://localhost:4200/');
    projector.setMenu(null);
    // projector.webContents.openDevTools();
  }

  constructor(
    private router: Router,
    private shortcuts: Shortcuts,
    private settings: SettingsJSONService,
    private files: FileService,
    private preview: PreviewService,
    private projector: ProjectorService
  ) { }


  ngOnInit() {
    if (remote.BrowserWindow.getAllWindows().length == 1)
      this.createProjector();

    if (remote.getCurrentWindow().id >= 2)
      this.router.navigateByUrl("/projector");

    this.shortcuts.load();

    if (this.settings.get(SettingsJSONService.SETTINGS.PROJECAO.INICIALIZAR.LOGO)) {
      var logoPath = this.files.getPathLogo();
      if (logoPath) {
        setTimeout(() => {
          this.preview.setImageSrc(new IFile(logoPath));
        }, 2000)
      }
    }

  }

}