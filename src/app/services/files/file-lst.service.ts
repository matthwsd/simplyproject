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
  private static readonly DATA = FileService.APP.replace(/app.asar/g, "") + "/data";
  public files: Subject<IFile> = new Subject();
  public clear: Subject<any> = new Subject();
  constructor() {
    if (!fs.existsSync(FileService.DATA))
      fs.mkdirSync(FileService.DATA);
  }

  public openDialog() {
    remote.dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: "Todos", extensions: ['jpg', 'png', 'gif', 'mp4', 'mkv', 'avi'] },
        { name: "Imagens", extensions: ['jpg', 'png', 'gif', "jpeg"] },
        { name: 'Vídeos', extensions: ['mp4', 'mkv', 'avi'] }
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
    var exist = fs.readdirSync(FileService.DATA).find((_) => { return _.indexOf(fileName) >= 0; });
    if (exist)
      fs.unlinkSync(`${FileService.DATA}/${exist}`);
    fs.copyFileSync(path, `${FileService.DATA}/${fileName}.${fileExtension}`);
  }

  /**
   * Copy a file as logo
   */
  public async copyFileAsLogo(path: string, fileName: string, fileExtension: string) {
    this.copyFileToAppDir(path, fileName, fileExtension);
  }

  /**
 * Copy a file as back
 */
  public async copyFileAsBack(path: string, fileName: string, fileExtension: string) {
    this.copyFileToAppDir(path, fileName, fileExtension);
  }

  /**
   * @returns logo path, if exist or null if doesn't exist
   */
  public getPathLogo() {
    if (fs.existsSync(`${FileService.DATA}`)) {
      let logo = fs.readdirSync(FileService.DATA).find((_) => { return _.indexOf("logo") >= 0; });
      if (logo)
        return `${FileService.DATA}/${logo}`.replace(/\//g,"\\");
      else
        return null;
    } else {
      return null;
    }
  }


  /**
 * @returns back path, if exist or null if doesn't exist
 */
  public getPathBack() {
    if (fs.existsSync(`${FileService.DATA}`)) {
      let back = fs.readdirSync(FileService.DATA).find((_) => { return _.indexOf("back") >= 0; });
      if (back)
        return `${FileService.DATA}/${back}`.replace(/\//g,"\\");
      else
        return null;
    } else {
      return null;
    }
  }
}
