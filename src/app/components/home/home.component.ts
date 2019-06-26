import { Component, OnInit, ApplicationRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { IFile } from "../../interfaces/filesLst";

import { ProjectorService } from '../../services/projector/projector.service';

import { remote, screen, ipcRenderer } from 'electron';

import { ISlide } from '../../interfaces/slide';

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
    
  }

  //Função para mudar o SRC do player
  onFileSelectPlay(fileSelected: IFile) {
   
  }

  onFileBackgroundSelect(fileSelected: IFile) {
    
  }

  onSlideChange(slide: ISlide) {

  }

  
  blackProjection() {
   
  }

  logoProjection() {
    
  }

  removeBackgroundProjection() {
    
  }

  clearPresentationProjection() {
  
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
    private router: Router,
    private projectorService: ProjectorService,
    private shortcuts: Shortcuts
  ) {  }


  ngOnInit() {

    if (remote.BrowserWindow.getAllWindows().length == 1)
      this.createProjector();

    if (remote.getCurrentWindow().id >= 2)
      this.router.navigateByUrl("/projector");

    this.shortcuts.load();
  }

}
