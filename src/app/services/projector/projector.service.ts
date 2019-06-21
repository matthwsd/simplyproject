import { Injectable } from '@angular/core';
import { ipcRenderer } from 'electron';


@Injectable({
  providedIn: 'root'
})
/**
 * Every command for Projection is here.
 */
export class ProjectorService {

  public create: Boolean = true;


  /**
   * Set a new Font Family
   * @param fontFamily 'font family', specfic;
   */
  public changeFontFamily(fontFamily: string) {
    ipcRenderer.send("projection-text-font", fontFamily);
  }

  /**
   * Set a new Font Size
   * @param fontSize in pt
   */
  public changeFontSize(fontSize: number) {
    ipcRenderer.send("projection-text-size", fontSize);
  }

  /**
   * Toggle or not the text shadow
   * @param has 
   */
  public hasFontShadow(has: boolean) {
    ipcRenderer.send("projection-text-shadow", has);
  }

  /**
   * Turn everything in black
   */
  public setBlackScreen() {
    ipcRenderer.send("clear-all");
  }

  /**
   * Set background as black
   */
  public setBackgroundBlack() {
    ipcRenderer.send("remove-background");
  }

  /**
   * Set a text and detail
   * @param text Main
   * @param detail Small
   */
  public setText(text: string | String, detail?: string | String) {
    ipcRenderer.send("text", { text: text, detail: detail });
  }

  /**
   * Clear all text in projection
   */
  public clearText() {
    ipcRenderer.send("text", { text: "", detail: "" });
  }

  /**
   * Set a new Video SRC
   * @param path path for a file
   */
  public setVideoSRC(path: string) {
    ipcRenderer.send("video-file", path);
  }

  /**
   * Set a new Image SRC
   * @param path path for a file
   */
  public setImageSrc(path: string) {
    ipcRenderer.send("image-file", path);
  }

  /**
   * Play current video
   */
  public playCurrentVideo() {
    ipcRenderer.send("video-play");
  }

  /**
   * Pause current video
   */
  public pauseCurrentVideo() {
    ipcRenderer.send("video-pause");
  }

  /**
   * Pause current video and set position time at begin
   */
  public stopCurrentVideo() {
    ipcRenderer.send("video-stop");
  }

  /**
   * Set video looper
   */
  public setVideoLoop(looping: boolean) {
    ipcRenderer.send("video-loop", looping);
  }

  /**
   * Set a new position for current video
   * @param position 
   */
  public setVideoPosition(position: number) {
    ipcRenderer.send("video-position", position);
  }

  constructor() { }
}
