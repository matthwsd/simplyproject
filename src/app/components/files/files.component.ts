import { Component, OnInit, ViewChild, ApplicationRef, Output, EventEmitter, ViewContainerRef } from '@angular/core';

import { FileService } from '../../services/files/file-lst.service';
import { IFile } from '../../interfaces/filesLst';
import { ToastrService } from '../../toastr/toastr.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.sass']
})
export class FilesComponent implements OnInit {

  @ViewChild('contextFileMenu') contextFileMenu: any;

  files: Array<IFile> = [];

  showContextFileMenu: boolean = false;
  showingContextFileMenuFor: number;
  isContextFileMenuForImage: boolean = false;

  top: number = 0;
  left: number = 0;

  @Output("onFileSelect") onFileSelect: EventEmitter<IFile> = new EventEmitter();
  @Output("onFilePlay") onFilePlay: EventEmitter<IFile> = new EventEmitter();
  @Output("onFileBackgroundSelect") onFileBackgroundSelect: EventEmitter<IFile> = new EventEmitter();
  @Output("onLogoSet") onLogoSet: EventEmitter<IFile> = new EventEmitter();

  selectFile(file: IFile) {
    this.onFileSelect.emit(file);
  }

  /**
   * Open a context menu for selected file click
   * @param i index of file
   * @param e event itself
   */
  contextMenu(i: number, e: any) {
    this.showContextFileMenu = true;
    this.top = e.clientY + 4;
    this.left = e.clientX + 4;
    this.showingContextFileMenuFor = i;
    if (this.files[i].type === "IMAGE")
      this.isContextFileMenuForImage = true;
    else
      this.isContextFileMenuForImage = false;

    this.zone.tick();
  }

  /**
    * Remove a specific file
    */
  removeFile() {
    this.files.splice(this.showingContextFileMenuFor, 1);
  }


  /**
   * Clear the file list
   */
  clearList() {
    this.files = [];
  }

  /**
  * Select a file and Emit its emitter as Play select
  */
  selectFileFromContextToPlay() {
    this.onFilePlay.emit(this.files[this.showingContextFileMenuFor]);
  }

  /**
   * Select a file and Emit its emitter as Background select
   */
  selectFileFromContextAsBackground() {
    this.onFileBackgroundSelect.emit(this.files[this.showingContextFileMenuFor]);
  }

  /**
   * Set selected image as logo
   */
  setAsLogo() {
    var f = this.files[this.showingContextFileMenuFor];
    this.filesService.copyFileAsLogo(f.path, "logo", f.extension);
    this.toastr.toastr("A imagem foi definida como logo.", { Type: 'Success' });
  }


  constructor(
    private filesService: FileService,
    private zone: ApplicationRef,
    private toastr: ToastrService,
    private vcr: ViewContainerRef
  ) {
    toastr.setRootViewContainerRef(vcr)
  }

  ngOnInit() {
    this.filesService.files.subscribe((_) => {
      this.files.push(_);
      this.zone.tick();
    })

    window
      .addEventListener("click", () => {
        this.showContextFileMenu = false;
      })
  }

}
