import { Injectable } from '@angular/core';
import { ipcRenderer } from 'electron';

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
   * @param path path for a file
   */
  public setVideoSrc(path: string) {
    ipcRenderer.send("preview-video-file", path);
  }

  /**
   * Set a new Image SRC
   * @param path path for a file
   */
  public setImageSrc(path: string) {
    ipcRenderer.send("preview-image-file", path);
  }

  constructor() { }


}
