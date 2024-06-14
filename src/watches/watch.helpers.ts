const onlyUnique = (value: string, index: number, array: any) => {
    return array.indexOf(value) === index;
  }

enum EVENT_TYPE_ENUM {
    CASUAL = "CASUAL",
    FORMAL = "FORMAL",
    OFFICE = "OFFICE",
    RUGGED = "RUGGED",
    SPORTS = "SPORTS"
} 

export {onlyUnique, EVENT_TYPE_ENUM}