import { Injectable } from '@angular/core';
import { ipcRenderer } from 'electron';
import { IFile } from '../../interfaces/filesLst';
@Injectable({
  providedIn: 'root'
})
export class PreviewService {

  /**
   * Turn everything in black
   */
  public setBlackScreen() {
    ipcRenderer.send("preview-clear-all");
  }

  /**
   * Set background as black
   */
  public setBackgroundBlack() {
    ipcRenderer.send("preview-remove-background");
  }

  /**
   * Set a text and detail
   * @param text Main
   * @param detail Small
   */
  public setText(text: string | String, detail?: string | String) {
    ipcRenderer.send("preview-text", { text: text, detail: detail });
  }

  /**
   * Clear all text in projection
   */
  public clearText() {
    ipcRenderer.send("preview-text", { text: "", detail: "" });
  }

  /**
   * Set a new Video SRC
   * @param file
   */
  public setVideoSrc(file: IFile, play?: boolean) {
    if (play)
      ipcRenderer.send("preview-video-file-play", file);
    else
      ipcRenderer.send("preview-video-file", file);
  }

  /**
   * Set a new video as background (don't clear the text, if they're showing)
   * @param file 
   */
  public setVideoSrcBackground(file: IFile) {
    console.log(file);
    ipcRenderer.send("preview-video-file-background", file);
  }

  /**
   * Set a new Image SRC
   * @param file
   */
  public setImageSrc(file: IFile) {
    ipcRenderer.send("preview-image-file", file);
  }

  constructor() { }


}
