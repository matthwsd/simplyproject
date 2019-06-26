import { Component, OnInit, ApplicationRef, ViewChild } from '@angular/core';
import { ProjectorService } from '../../services/projector/projector.service';
import { SettingsJSONService } from '../../services/settings/settings-json.service';
import { FileService } from '../../services/files/file-lst.service';
import { remote } from 'electron';

@Component({
  selector: 'app-projector',
  templateUrl: './projector.component.html',
  styleUrls: ['./projector.component.sass']
})
export class ProjectorComponent implements OnInit {

  public currentMedia = "";

  private isLooping = false;

  private API: HTMLVideoElement;

  @ViewChild('videoPlayer') videoPlayer: any;
  @ViewChild('textShower') textShower: any;
  @ViewChild('detailShower') detailShower: any;

  public showingVideo = false;
  public showingImage = false;

  public textToShow = "";
  public detailToShow = "";

  textHasShadow = false;

  private listenerWereCreated = false;


  private showVideo() {
    this.showingImage = false;
    this.showingVideo = true;
  }

  private showImage() {
    this.showingImage = true;
    this.showingVideo = false;
  }

  private videoListeners() {

    remote.ipcMain.on("video-file", (event, arg) => {
      this.showVideo();
      this.currentMedia = arg;
      this.zone.tick();
    })

    remote.ipcMain.on("video-file-background", (event, arg) => {
      this.showVideo();
      this.currentMedia = arg;
      this.zone.tick();
    })

    remote.ipcMain.on("video-play", (event, arg) => {
      this.API.play();
      this.zone.tick();
    })

    remote.ipcMain.on("video-pause", (event, arg) => {
      this.API.pause();
      this.zone.tick();
    })

    remote.ipcMain.on("video-stop", (event, arg) => {
      this.API.pause();
      this.API.currentTime = 0;
      this.zone.tick();
    })

    remote.ipcMain.on("video-loop", (event, arg) => {
      this.isLooping = arg;
      this.zone.tick();
    })

    remote.ipcMain.on("video-position", (event, arg) => {
      this.API.currentTime = arg;
    })

  }

  private videoEvents() {
    let player = document.getElementsByClassName("video-player")[0];

    player
      .addEventListener('ended', () => {
        if (this.isLooping) {
          this.API.currentTime = 0;
          this.API.play();
        }
      })
  }

  private imageListeners() {
    remote.ipcMain.on("image-file", (event, arg) => {
      this.showImage();
      this.currentMedia = arg;
      this.zone.tick();
    })
  }

  private extraListeners() {
    remote.ipcMain.on("text", (event, arg) => {
      this.textToShow = arg.text;
      this.detailToShow = arg.detail;
      this.zone.tick();
    })

    remote.ipcMain.on("clear-all", () => {
      this.currentMedia = "";
      this.textToShow = "";
      this.detailToShow = "";
      this.showingImage = false;
      this.showingVideo = false;
      this.zone.tick();
    })

    remote.ipcMain.on("remove-background", () => {
      this.currentMedia = "";
      this.showingImage = false;
      this.showingVideo = false;
      this.zone.tick();
    })
  }

  private configListeners() {
    remote.ipcMain.on("projection-text-font", (event, arg) => {
      this.textShower.nativeElement.style.fontFamily = arg;
      this.detailShower.nativeElement.style.fontFamily = arg;
      this.zone.tick();
    })

    remote.ipcMain.on("projection-text-size", (event, arg) => {
      this.textShower.nativeElement.style.fontSize = `${arg}pt`;
      this.zone.tick();
    })

    remote.ipcMain.on("projection-text-shadow", (event, arg) => {
      this.textHasShadow = arg;
      this.zone.tick();
    })

  }

  private loadSettings() {
    //Carregar font e tamanho
    this.textShower.nativeElement.style.fontFamily = this.settings.get(SettingsJSONService.SETTINGS.PROJECAO.FONT.FAMILY);
    this.textShower.nativeElement.style.fontSize = this.settings.get(SettingsJSONService.SETTINGS.PROJECAO.FONT.SIZE) + "pt";
    this.textHasShadow = this.settings.get(SettingsJSONService.SETTINGS.PROJECAO.FONT.SHADOW);
  }

  constructor(
    private projectorService: ProjectorService,
    private zone: ApplicationRef,
    private settings: SettingsJSONService,
    private fileService: FileService
  ) {
  }

  ngOnInit() {
    this.API = this.videoPlayer.nativeElement;
    this.API.muted = true;

    if (!this.listenerWereCreated) {
      this.videoListeners();
      this.videoEvents();

      this.imageListeners();
      this.extraListeners();
      this.configListeners();
      this.listenerWereCreated = true;
    }

    this.loadSettings();
  }

}
