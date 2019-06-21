import { Injectable } from '@angular/core';
import { JsonFile } from '../json-file';

import * as fs from 'fs';

@Injectable({
    providedIn: 'root'
})
export class BibleJson extends JsonFile {

    private static readonly BIBLES = `${BibleJson.STATICDATA}`;

    getBibles(): Array<string> {
        var Bibles: Array<string> = new Array();
        fs.readdirSync(BibleJson.BIBLES)
            .forEach((bible) => {
                if (bible.indexOf('json') == -1)
                    Bibles.push(bible.replace(".xml", ""))
            })

        return Bibles;
    }

    getScripture(version: 'aa' | 'acf' | 'nvi'): IBible[] {
        return super.getFromXML(`${BibleJson.BIBLES}/${version}.xml`).bible.b as IBible[];
    }


}

export interface IBible {
    $: {
        id: string;
        n: string;
    };

    c: IBibleChapter[];

}

interface IBibleChapter {
    $: {
        n: string | number
    };
    v: IBibleText[]
}

interface IBibleText {
    $: {
        n: string | number
    }
    _: string;
}
