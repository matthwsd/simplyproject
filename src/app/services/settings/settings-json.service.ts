import { Injectable } from '@angular/core';
import { JsonFile } from '../json-file';

import * as electronSettings from 'electron-settings';


@Injectable({
  providedIn: 'root'
})
export class SettingsJSONService extends JsonFile {
  private readonly PATH = `${SettingsJSONService.DATA}/settings.json`

  private static readonly DEFAULT = {
    PROJECAO: {
      FONT: {
        FAMILY: "Montserrat, sans-serif",
        SIZE: 84,
        SHADOW: false
      },
      INICIALIZAR: {
        LOGO: false
      }
    }
  };

  static readonly SETTINGS = {
    PROJECAO: {
      FONT: {
        FAMILY: "PROJECAO.FONT.FAMILY",
        SIZE: "PROJECAO.FONT.SIZE",
        SHADOW: "PROJECAO.FONT.SHADOW"
      },
      INICIALIZAR: {
        LOGO: "PROJECAO.INICIALIZAR.LOGO"
      }
    }
  }

  constructor() {
    super();
    this.exist(this.PATH, true);
    electronSettings.setPath(this.PATH);
  }

  private fetchFromObject(obj, prop) {
    //property not found
    if (typeof obj === 'undefined') return false;

    //index of next property split
    var _index = prop.indexOf('.')

    //property split found; recursive call
    if (_index > -1) {
      //get object at property (before split), pass on remainder
      return this.fetchFromObject(obj[prop.substring(0, _index)], prop.substr(_index + 1));
    }
    return obj[prop];
  }

  get(SETTINGS: string): any {
    if (electronSettings.has(SETTINGS)) {
      return electronSettings.get(SETTINGS);
    }
    else {
      return this.fetchFromObject(SettingsJSONService.DEFAULT, SETTINGS);
    }
  }

  save(SETTINGS: string, VALUE: string | number | boolean) {
    return electronSettings.set(SETTINGS, VALUE);
  }

}
