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
    connexe:boolean
}

export type Station = {

    name: string,
    line: string,
    time: string,
    accessible:boolean,
    longitude: number,
    latitude: number
}