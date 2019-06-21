import { forEach } from "@angular/router/src/utils/collection";
import * as path from 'path';

export class IFile {

    public title: string;
    public path: string;
    public extension: string;
    public type: string;

    public static IMAGES: String[] = [
        'png', 'jpg'
    ];

    public static VIDEOS: String[] = [
        'avi', 'mp4', 'mkv', 'mov'
    ];

    public static TYPE: any = {
        "VIDEO": "VIDEO",
        "IMAGE": "IMAGE"
    };


    public static getTitle(filepath: string): string {
        let name = filepath.split(/\\/g)
        return name[name.length - 1];
    }

    public static getExtension(filepath: string): string {
        var ext = path.extname(filepath || '').split('.');
        return ext[ext.length - 1];
    }

    public static getType(extension: string): string {

        let type = "";

        IFile.IMAGES.forEach((img) => {
            if (img == extension) {
                type = IFile.TYPE.IMAGE;
                return false;
            }
        })

        if (!type) {
            IFile.VIDEOS.forEach((vid) => {
                if (vid == extension) {
                    type = IFile.TYPE.VIDEO;
                    return false;
                }
            })
        }

        return type ? type : 'unknow';
    }

    constructor(path: string){
        this.title = IFile.getTitle(path);
        this.path = path;
        this.extension = IFile.getExtension(path);
        this.title = IFile.getType(this.extension);
    }
}