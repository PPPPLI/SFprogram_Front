import { Injectable} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpRequestService } from './http-request.service';

@Injectable({
  providedIn: 'root'
})
export class LinesService{


    data:any = 0

    iconMap:Map<string,string> = new Map([

        ["LINE_1","../../assets/img/line1.png"],
        ["LINE_2","../../assets/img/line2.png"],
        ["LINE_3","../../assets/img/line3.png"],
        ["LINE_3B","../../assets/img/line3B.png"],
        ["LINE_4","../../assets/img/line4.png"],
        ["LINE_5","../../assets/img/line5.png"],
        ["LINE_6","../../assets/img/line6.png"],
        ["LINE_7","../../assets/img/line7.png"],
        ["LINE_7B","../../assets/img/line7B.png"],
        ["LINE_8","../../assets/img/line8.png"],
        ["LINE_9","../../assets/img/line9.png"],
        ["LINE_10","../../assets/img/line10.png"],
        ["LINE_11","../../assets/img/line11.png"],
        ["LINE_12","../../assets/img/line12.png"],
        ["LINE_13","../../assets/img/line13.png"],
        ["LINE_14","../../assets/img/line14.png"]
    ])

    

    colors:Map<string,string> = new Map([
        ["LINE_1","#ffbe00"],
        ["LINE_2","#0055c8"],
        ["LINE_3","#6e6e00"],
        ["LINE_3B","82c8e6"],
        ["LINE_4","#a0006e"],
        ["LINE_5","#ff5a00"],
        ["LINE_6","#82dc73"],
        ["LINE_7","#ff82b4"],
        ["LINE_7B","#82dc73"],
        ["LINE_8","#d282be"],
        ["LINE_9","#d2d200"],
        ["LINE_10","#dc9600"],
        ["LINE_11","#6e491e"],
        ["LINE_12","#00643c"],
        ["LINE_13","#82c8e6"],
        ["LINE_14","#640082"]])

    constructor(private getRequest:HttpRequestService){

        this.getRequest.getlines("/lines").subscribe(res=>{

            this.recoverData(res)
        })
    }

    
    current = {

        start:"",
        destination:""
    }

    isRecover$ = new BehaviorSubject(this.data);
    currentChoice$ = new BehaviorSubject(this.current)
    colorMap$ = new BehaviorSubject(this.colors)
    iconMap$ = new BehaviorSubject(this.iconMap)

    recoverData(data:any){

        this.data = data;

        this.isRecover$.next(this.data);
    }

    recouverCurrentChoice(data:string,target:boolean){

        if(target){

            this.current.destination = data
            this.currentChoice$.next(this.current)
        }else{

            this.current.start = data
            this.currentChoice$.next(this.current)
        }
    }
}
