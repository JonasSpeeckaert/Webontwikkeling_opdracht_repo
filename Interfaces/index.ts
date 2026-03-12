

export interface SetObj{
    id: string;
    name: string;
    code: string;
    isStandardLegal: boolean;
    logoUrl: string;
}

export interface DeckObj {
    id: string;
    name: string;
    description: string;
    manaValue: number;
    isLegendary: boolean;
    releaseDate: string;
    imageUrl: string;
    imagePath: string;
    rarity: string;
    types: string[];
    cardSet: SetObj;

}


