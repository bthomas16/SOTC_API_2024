import { UnitWatch } from "./watch.interface";

export enum WatchStatusEnum {
    DEFAULT = "Default",
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

export class WatchClass {
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
    modelNumber: string;
    accuracy: number;

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


    constructor(newWatch : UnitWatch) {
        this.ownerId = newWatch.ownerId
        this.name = newWatch?.name
        this.brand = newWatch?.brand
        this.image = newWatch?.image
        this.style = newWatch?.style
        this.sortOrder= newWatch?.sortOrder
        this.movementType = newWatch?.movementType
        this.caseWidth= newWatch?.caseWidth
        this.status = newWatch?.status || WatchStatusEnum.DEFAULT

        this.movement = newWatch?.movement
        this.modelNumber = newWatch?.modelNumber
        this.accuracy = newWatch?.accuracy || 0;

        this.crystal = newWatch?.crystal
        this.lugWidth = newWatch?.lugWidth
        this.caseHeight = newWatch?.caseHeight
        this.dialColor = newWatch?.dialColor
        this.bezelColor = newWatch?.bezelColor
        this.bezelMaterial = newWatch?.bezelMaterial
        this.caseColor = newWatch?.caseColor
        this.caseMaterial = newWatch?.caseMaterial

        this.strap = newWatch?.strap
        this.strapColor = newWatch?.strapColor
        this.strapType = newWatch?.strapType

        this.condition = newWatch?.condition || 0
        this.yearManufactured = newWatch?.yearManufactured
        this.numberDaysOwned = newWatch?.numberDaysOwned
        this.numberTimesWorn = newWatch?.numberTimesWorn
        this.totalTimeWorn = newWatch?.totalTimeWorn

        this.dateAcquired = newWatch?.dateAcquired
        this.dateLastServiced = newWatch?.dateLastServiced
        this.dateLastWorn = newWatch?.dateLastWorn
        this.dateLastWOTD_Recommended = newWatch?.dateLastWOTD_Recommended
        this.datelastWOTD_Selected = newWatch?.datelastWOTD_Selected
        this.isWOTD = newWatch?.isWOTD || false
        this.isCurrentlyWearing = newWatch?.isCurrentlyWearing || false

        this.priceAcquiredFor = newWatch?.priceAcquiredFor
        this.cashValue = newWatch?.cashValue

        this.hasBox = newWatch?.hasBox || false
        this.hasPapers = newWatch?.hasPapers || false
        this.isUnderWarranty = newWatch?.isUnderWarranty || false
        this.warrantyEndDate = newWatch?.warrantyEndDate
    }
}