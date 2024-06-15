import { WatchStatusEnum } from "./watch.class";

export interface Watch {
    ownerId : string;
    name : string;
    image : string;
    sortOrder: number;
    brand? : string;
    style? : string;
    movementType? : string;
    caseWidth?: number;
    status? : WatchStatusEnum;

    movement? : string;
    modelNumber?: string;
    accuracy?: number;

    crystal? : string;
    lugWidth? : string;
    caseHeight? : string;
    dialColor? : string;
    bezelColor? : string;
    bezelMaterial? : string;
    caseColor? : string;
    caseMaterial? : string;

    strap? : string;
    strapColor? : string;
    strapType? : string;

    condition? : number;
    yearManufactured? : number;
    numberDaysOwned? : number;
    numberTimesWorn? : number;
    totalTimeWorn? : number;

    dateAcquired? : any;
    dateLastServiced? : any;
    dateLastWorn? : any;
    dateLastWOTD_Recommended? : any;
    datelastWOTD_Selected? : any;
    isWOTD? : boolean;
    isCurrentlyWearing? : boolean;

    priceAcquiredFor? : number;
    cashValue? : number;

    hasBox? : boolean;
    hasPapers? : boolean;
    isUnderWarranty? : boolean;
    warrantyEndDate? : string;
}

export interface UnitWatch extends Watch {
    id : string
}

export interface Watches {
    [key : string] : UnitWatch
}