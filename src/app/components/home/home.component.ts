import { Component, OnInit, ApplicationRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { IFile } from "../../interfaces/filesLst";

import { ProjectorService } from '../../services/projector/projector.service';
import { SettingsJSONService } from '../../services/settings/settings-json.service';

import { remote, screen, ipcRenderer } from 'electron';

import { ISlide } from '../../interfaces/slide';

import { FileService } from '../../services/files/file-lst.service';

import { ToastrService } from '../../toastr/toastr.service';

import { Shortcuts } from '../../services/shortcuts/shortcuts.service';

import * as path from 'path';
import * as url from 'url';


const args = process.argv.slice(1);


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

  projectorAPI: Electron.BrowserWindow = null;


  @ViewChild('videoPlayer') videoPlayer: any;
  @ViewChild('imageShow') imageShow: any;
  @ViewChild('position') position: any;
  @ViewChild('volume') volume: any;
  //Função para mudar o SRC do player
  onFileSelect(fileSelected: IFile) {
    this.detailToShow = "";
    this.textToShow = "";
    ipcRenderer.send("text", {
      text: "",
      detail: ""
    })


    if (this.isPlaying) {
      this.toggleStop()
    }
    this.API.currentTime = 0;
    this.currentMedia = `file://${fileSelected.path}`;
    if (fileSelected.type == IFile.TYPE.VIDEO) {
      this.showImage = false;
      this.showVideo = true;
      this.zone.tick();

      this.projectorService.setVideoSRC(this.currentMedia);

    } else {
      this.showVideo = false;
      this.showImage = true;
      this.zone.tick();

      this.projectorService.setImageSrc(this.currentMedia);
    }

  }

  //Função para mudar o SRC do player
  onFileSelectPlay(fileSelected: IFile) {
    this.detailToShow = "";
    this.textToShow = "";
    this.projectorService.clearText();

    if (this.isPlaying) {
      this.toggleStop()
    }
    this.API.currentTime = 0;
    this.currentMedia = `file://${fileSelected.path}`;
    if (fileSelected.type == IFile.TYPE.VIDEO) {
      this.showImage = false;
      this.showVideo = true;

      this.zone.tick();

      this.projectorService.setVideoSRC(this.currentMedia);
      this.togglePlay();

    } else {
      this.showVideo = false;
      this.showImage = true;
      this.zone.tick();

      this.projectorService.setImageSrc(this.currentMedia);
    }


  }

  onFileBackgroundSelect(fileSelected: IFile) {
    if (this.isPlaying) {
      this.toggleStop()
    }
    this.API.currentTime = 0;
    this.currentMedia = `file://${fileSelected.path}`;
    if (fileSelected.type == IFile.TYPE.VIDEO) {
      this.showImage = false;
      this.showVideo = true;

      this.zone.tick();
      this.projectorService.setVideoSRC(this.currentMedia);
      this.togglePlay();
      if (!this.isLooping)
        this.toggleLoop();
    } else {
      this.showVideo = false;
      this.showImage = true;
      this.zone.tick();

      this.projectorService.setImageSrc(this.currentMedia);
    }


  }

  onSlideChange(slide: ISlide) {
    this.textToShow = slide.text;
    this.detailToShow = slide.detail;
    this.projectorService.setText(slide.text, slide.detail);
  }

  togglePlay() {
    if (this.currentMedia) {
      this.isPlaying = true;
      this.isPaused = false;
      this.zone.tick();
      this.projectorService.playCurrentVideo();
      this.API.play()
        .catch()
        .then()
    }
  }

  togglePause() {
    this.projectorService.pauseCurrentVideo();
    this.API.pause();

  }

  toggleStop() {
    this.isPlaying = false;
    this.isPaused = true;
    this.projectorService.stopCurrentVideo();
    this.API.pause();
    this.API.currentTime = 0;
  }

  toggleMute() {
    this.API.muted = !this.API.muted;
  }

  toggleLoop() {
    this.isLooping = !this.isLooping;
    this.zone.tick();
    this.projectorService.setVideoLoop(this.isLooping);
  }

  onVideoEnd(player: HTMLMediaElement) {
    this.API.currentTime = 0;
    this.API.play();
  }

  setPosition() {
    let toSet = this.API.duration * (this.position.nativeElement.value / 100);
    this.projectorService.setVideoPosition(toSet);
    this.API.currentTime = toSet;
  }

  setVolume() {
    if (this.API.muted)
      this.API.muted = false;
    this.API.volume = this.volume.nativeElement.value;
  }

  blackProjection() {
    if (this.isPlaying)
      this.toggleStop();

    this.currentMedia = "";
    this.textToShow = "";
    this.detailToShow = "";

    this.projectorService.setBlackScreen();
  }

  logoProjection() {
    let logoPath = this.fileService.getPathLogo();
    if (logoPath)
      this.onFileSelect(new IFile(logoPath));
    else
      this.toast.toastr("Ainda não foi definida uma imagem como logo.", { Type: "Error", Duration: 3500 })
  }

  removeBackgroundProjection() {
    if (this.isPlaying)
      this.toggleStop();
    this.currentMedia = "";
    this.projectorService.setBackgroundBlack();
  }

  clearPresentationProjection() {
    this.textToShow = "";
    this.detailToShow = "";
    this.projectorService.clearText();
  }

  private loadDefault() {
    this.API.volume = 1;
    this.currentVolume = 1;
    this.API.currentTime = 0;
    this.currentTime = 0;
    this.currentProgress = 0;
  }

  private setEventsPlayer() {
    // On Ended
    let player = document
      .getElementsByClassName("video-player")[0];

    player
      .addEventListener('ended', () => {
        if (this.isLooping) {
          this.API.currentTime = 0;
          this.API.play();
        } else {
          this.logoProjection();
        }
      }, false);

    player
      .addEventListener('timeupdate', () => {
        this.currentTime = this.API.currentTime;
        this.currentProgress = this.currentTime / this.API.duration * 100;
        this.zone.tick();
      }, false);

    player
      .addEventListener('volumechange', () => {
        this.currentVolume = this.API.volume;
        this.zone.tick();
      }, false);

    player
      .addEventListener('play', () => {
        this.isPlaying = true;
        this.isPaused = false
        this.zone.tick();
      }, false);

    player
      .addEventListener('pause', () => {
        this.isPlaying = false;
        this.isPaused = true
        this.zone.tick();
      }, false);
  }

  private createProjector() {
    const BrowserWindow = remote.BrowserWindow;

    let snd = screen.getAllDisplays().find((display) => { return display.bounds.x !== 0 && display.bounds.y !== 0 });
    const sc = snd ? snd.workArea : screen.getPrimaryDisplay().workArea;

    this.projectorService.create = true;

    let projector = new BrowserWindow({
      width: sc.width,
      height: sc.height,
      x: sc.x,
      y: sc.y,
      frame: false,
      alwaysOnTop: false,
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
    this.projectorAPI = projector;
  }

  constructor(
    private zone: ApplicationRef,
    private router: Router,
    private projectorService: ProjectorService,
    private settingsService: SettingsJSONService,
    private fileService: FileService,
    private toast: ToastrService,
    private viewContainer: ViewContainerRef,
    private shortcuts: Shortcuts
  ) {
    toast.setRootViewContainerRef(this.viewContainer);
  }


  ngOnInit() {

    this.API = this.videoPlayer.nativeElement;
    this.loadDefault();
    this.setEventsPlayer();

    this.IMG = this.imageShow.nativeElement;

    if (remote.BrowserWindow.getAllWindows().length == 1)
      this.createProjector();

    if (remote.getCurrentWindow().id >= 2)
      this.router.navigateByUrl("/projector");

    if (this.settingsService.get(SettingsJSONService.SETTINGS.PROJECAO.INICIALIZAR.LOGO))
      setTimeout(() => { this.logoProjection(); }, 3000);


    this.shortcuts.load();
  }

}
