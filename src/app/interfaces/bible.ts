import { TrustedString } from "@angular/core/src/sanitization/bypass";

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

export interface IBibleFetched {
    text: string;
    ref: string;
    book: string;
}
