export interface Watch {
    ownerId : string;
    name : string;
    brand : string;
    image : string;
    style : string;

    movementType : string;
    modelNumber: string;
    size: number;

    movement : string;
    status : WatchStatusEnum;
    crystal : string;
    lugWidth : string;
    caseWidth : string;
    caseHeight : string;
    dialColor : string;
    bezelColor : string;
    bezelMaterial : string;
    caseColor : string;
    caseMaterial : string;

    strap: string;
    strapColor: string;
    accuracy: string;

    condition: number;
    yearManufactured: number;
    numberDaysOwned: number;
    numberTimesWorn: number;
    totalTimeWorn: number;

    dateAcquired: any;
    dateLastServiced: any;
    dateLastWorn: any;
    dateLastWOTD_Recommended: any;
    datelastWOTD_Selected: any;
    isWOTD: boolean;
    isCurrentlyWearing: boolean;

    priceAcquiredFor: number;
    cashValue: number;

    hasBox: boolean;
    hasPapers: boolean;
    isUnderWarranty: boolean;
}

export interface UnitWatch extends Watch {
    id : string
}

export interface Watches {
    [key : string] : UnitWatch
}

enum WatchStatusEnum {
    DEFAULT = "All",
    KEEPER = "Keeper",
    FOR_TRADE = "For Trade",
    FOR_SALE = "For Sale",
    FSOT = "For Sale or Trade",
    IN_REPAIRS = "Repairs",
    SOLD = "Sold",
    TRADED = "Traded",
    GIFTED = "Gifted",
    REVIEWING = "Reviewing",
    INTERESTED = "Interested"
    // TRYING_OUT = "Trying Out",
}