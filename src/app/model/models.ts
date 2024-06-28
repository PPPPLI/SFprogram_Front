export type Trajet = {

    
    start : string,
    destination: string,
    time: string,
    day: number,
    reverse : boolean
}

export type Res = {

    path : Station[],
    carbone:string,
    connexe:boolean,
    unreachable:string[]
}



export type Station = {

    name: string,
    line: string,
    time: string,
    accessible:boolean,
    longitude: number,
    latitude: number,
    culture:{
        name:string,
        latitude:number,
        longitude:number
    }}