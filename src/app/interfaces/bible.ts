export class IBible {
    $: {
        id: string;
        n: string;
    };

    c: IBibleChapter[];

}

class IBibleChapter {
    $: {
        n: string | number
    };
    v: IBibleText[]
}

class IBibleText {
    $: {
        n: string | number
    }
    _: string;
}

export class IBibleFetched {
    text: string;
    ref: string;
    book: string;
}
