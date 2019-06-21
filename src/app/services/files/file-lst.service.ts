import { Injectable } from '@angular/core';
import { IFile } from "../../interfaces/filesLst";
import * as fs from 'fs';
import { remote } from 'electron';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private static readonly APP = remote.app.getAppPath().replace(/\\/g, "/");
  private static readonly DATA = FileService.APP.replace(/app.asar/g, "") + "/files";
  public files: Subject<IFile> = new Subject();
  constructor() {
    if (!fs.existsSync(FileService.DATA))
      fs.mkdirSync(FileService.DATA);
  }

  public openDialog(){
    remote.dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: "Todos", extensions: ['jpg', 'png', 'gif', 'mp4', 'mkv', 'avi', 'mov'] },
        { name: "Imagens", extensions: ['jpg', 'png', 'gif'] },
        { name: 'Vídeos', extensions: ['mp4', 'mkv', 'avi', 'mov'] }
      ]
    }, (_) => {
      //Arquivos Selecionados
      if (_ !== undefined) {
        _.forEach((file) => {
          let f: IFile = { path: file, title: IFile.getTitle(file), extension: IFile.getExtension(file), type: IFile.getType(IFile.getExtension(file)) };
          this.files.next(f);
        })
      }

    })
  }

  /**
   * Copy a file to App Dir
   * @param path path of file which will be copied
   */
  private async copyFileToAppDir(path: string, fileName: string, fileExtension: string) {

    fs.copyFile(path, `${FileService.DATA}/${fileName}.${fileExtension}`, (err) => {
      if (err) alert(err.message);
    })
  }

  /**
   * Copy a file as logo
   */
  public async copyFileAsLogo(path: string, fileName: string, fileExtension: string) {
    this.copyFileToAppDir(path, fileName, fileExtension);
  }

  /**
   * @returns logo path, if exist or null if doesn't exist
   */
  public getPathLogo() {
    if (fs.existsSync(`${FileService.DATA}`)) {
      let logo = fs.readdirSync(FileService.DATA).find((_) => { return _.indexOf("logo") >= 0; });
      if (logo)
        return `${FileService.DATA}/${logo}`;
      else
        return null;
    } else {
      return null;
    }
  }


}
