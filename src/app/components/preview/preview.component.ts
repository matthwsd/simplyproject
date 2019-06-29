import { Component, OnInit, ViewChild, ApplicationRef } from '@angular/core';
import { FileService } from "../../services/files/file-lst.service";
import { ProjectorService } from "../../services/projector/projector.service";
import { ipcRenderer, remote } from 'electron';
import { ISlide } from '../../interfaces/slide';
import { IFile } from "../../interfaces/filesLst";

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

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
    if (fileSelected.type == 'VIDEO') {
      this.showImage = false;
      this.showVideo = true;
      this.zone.tick();

      this.projectorService.setVideoSRC(fileSelected);

    } else {
      this.showVideo = false;
      this.showImage = true;
      this.zone.tick();

      this.projectorService.setImageSrc(fileSelected);
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

      this.projectorService.setVideoSRC(fileSelected);
      this.togglePlay();

    } else {
      this.showVideo = false;
      this.showImage = true;
      this.zone.tick();

      this.projectorService.setImageSrc(fileSelected);
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
      this.projectorService.setVideoSRC(fileSelected);
      this.togglePlay();
      if (!this.isLooping)
        this.toggleLoop();
    } else {
      this.showVideo = false;
      this.showImage = true;
      this.zone.tick();

      this.projectorService.setImageSrc(fileSelected);
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

  onVideoEnd() {
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

  private videoListeners() {

    remote.ipcMain.on("preview-video-file", (event, arg) => {
      this.onFileSelect(arg);
      console.log(arg);
    })

    remote.ipcMain.on("preview-video-file-background", (event, arg) => {
      this.onFileBackgroundSelect(arg);
      console.log(arg);
    })

    remote.ipcMain.on("preview-video-file-play", (event, arg) => {
      this.onFileSelectPlay(arg);
      console.log(arg);
    })
  }

  private imageListeners() {
    remote.ipcMain.on("preview-image-file", (event, arg) => {
      this.onFileSelect(arg);
    })
  }

  private extraListeners() {
    remote.ipcMain.on("preview-text", (event, arg) => {
      this.textToShow = arg.text;
      this.detailToShow = arg.detail;
      this.zone.tick();
    })

    remote.ipcMain.on("preview-clear-all", () => {
      this.blackProjection();
      this.zone.tick();
    })

    remote.ipcMain.on("preview-remove-background", () => {
      this.currentMedia = null;
      this.zone.tick();
    })
  }

  constructor(
    private zone: ApplicationRef,
    private projectorService: ProjectorService,
    private fileService: FileService
  ) { }

  ngOnInit() {
    this.API = this.videoPlayer.nativeElement;
    this.IMG = this.imageShow.nativeElement;
    this.loadDefault();
    this.setEventsPlayer();
    this.videoListeners();
    this.imageListeners();
    this.extraListeners();
    console.log("Preview foi iniciado");
  }

}
