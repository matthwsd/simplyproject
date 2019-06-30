import * as fs from 'fs';
import { remote } from 'electron';
import * as xml2js from 'xml2js';

export abstract class JsonFile {
    /**
     * Root of APP.ASAR Data
     */
    static readonly APP = remote.app.getAppPath().replace(/\\/g, "/");
    /**
     * Path without APP.ASAR Data
     */
    static readonly DATA = JsonFile.APP.replace(/app.asar/g, "") + "/data";
    /**
     * Path for APP.ASAR Data
     */
    static readonly STATICDATA = JsonFile.APP + "/data";

    public get<T>(PATH: string): any {
        return this.decodeFromFile<T>(PATH);
    }

    public getFromXML(PATH: string): any {
        return this.decodeXMLFromFile(PATH);
    }

    constructor() {
        this.exist(JsonFile.DATA, true, true);
    }

    protected exist(PATH: string, createIfNotExist = false, isDir = false): boolean {
        if (fs.existsSync(PATH))
            return true;
        else if (!fs.existsSync(PATH))
            if (!createIfNotExist)
                return false;
            else {
                if (isDir)
                    fs.mkdirSync(PATH);
                else
                    this.writeFile(PATH, []);
                return true;
            }
    }

    protected writeFile(PATH: string, ToSAVE: any, error?, success?) {
        try {
            fs.writeFileSync(PATH, JSON.stringify(ToSAVE));
            if (success)
                success();
        }
        catch{
            if (error)
                error();
        }
    }

    protected decodeFromFile<T>(PATH: string): any {
        if (this.exist(PATH, true)) {
            let fileRead = fs.readFileSync(PATH, 'utf8');
            var r = <T>JSON.parse(fileRead);
            return r ? r : new Array<T>();
        }
        else
            return null;
    }

    protected decodeXMLFromFile(PATH: string): any {
        if (this.exist(PATH, true)) {
            let fileRead = fs.readFileSync(PATH, 'utf8');
            var parsed;

            xml2js.parseString(fileRead, (err, result) => {
                parsed = result;
            })
            return parsed;
        }
        else
            return null;

    }
}