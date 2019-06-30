import { forEach } from "@angular/router/src/utils/collection";
import * as path from 'path';

export class IFile {

    public title: string;
    public path: string;
    public extension: string;
    public type: "VIDEO" | "IMAGE";

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

    public static getType(extension: string): 'VIDEO' | 'IMAGE' | null {

        let type: 'VIDEO' | 'IMAGE';

        IFile.IMAGES.forEach((img) => {
            if (img == extension) {
                type = 'IMAGE';
                return false;
            }
        })

        if (!type) {
            IFile.VIDEOS.forEach((vid) => {
                if (vid == extension) {
                    type = 'VIDEO';
                    return false;
                }
            })
        }

        return type ? type : null;
    }

    constructor(path: string) {
        this.title = IFile.getTitle(path);
        this.path = path;
        this.extension = IFile.getExtension(path);
        this.type = IFile.getType(this.extension);
    }
}