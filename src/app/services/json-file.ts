import * as fs from 'fs';
import { remote } from 'electron';

export abstract class JsonFile {
    static readonly APP = remote.app.getAppPath().replace(/\\/g, "/");
    static readonly DATA = JsonFile.APP.replace(/app.asar/g, "data");

    public get<T>(PATH: string): any {
        return this.decodeFromFile<T>(PATH);
    }

    constructor() {
        this.exist(JsonFile.DATA, true, true);
    }

    protected exist(PATH: string, createIfNotExist = false, isDir = false): boolean {
        if (fs.existsSync(PATH))
            return true;
        else if (!fs.existsSync(PATH))
            if (!createIfNotExist)
                return false
            else {
                if (isDir)
                    fs.mkdirSync(PATH)
                else
                    this.writeFile(PATH, null)
                return true;
            }
    }

    protected writeFile(PATH: string, ToSAVE: any, error?) {
        fs.writeFile(PATH, JSON.stringify(ToSAVE), (err) => {
            if (err && error)
                error(err);
        });
    }

    protected decodeFromFile<T>(PATH: string): any {
        if (this.exist(PATH, true)) {
            var r = <T>JSON.parse(fs.readFileSync(PATH, 'utf8'));
            return r ? r : new Array<T>();
        }
        else
            return null;
    }

}