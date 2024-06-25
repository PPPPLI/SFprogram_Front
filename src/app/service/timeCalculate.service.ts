import { Injectable } from "@angular/core";

@Injectable({
    providedIn:"root"
})

export class timeCalculatorService{

    parseTimeString(timeString:string) {
        let [hours, minutes] = timeString.split(':').map(Number);
        let date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
    }

    calculator(start:string,end:string){

        let startTime = this.parseTimeString(start)
        let endTime = this.parseTimeString(end)

        return end.slice(0,2) === "00" && start.slice(0,2) !== '00'?(endTime.getTime()+(24*60*60*1000) - startTime.getTime()) /(1000 * 60):(endTime.getTime() - startTime.getTime()) /(1000 * 60)
    }

}