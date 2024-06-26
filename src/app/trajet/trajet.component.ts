import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { Station } from '../model/models';
import { CommonModule, NgStyle, SlicePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { LinesService } from '../service/lines.service';

@Component({
  selector: 'trajetComponet',
  standalone: true,
  imports: [CommonModule, SlicePipe,NgStyle],
  templateUrl: './trajet.component.html',
  styleUrl: './trajet.component.css'
})
export class TrajetComponent implements OnInit,OnDestroy,AfterViewInit{

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
    
    
    constructor(private data:LinesService,private render2:Renderer2, private elementRef:ElementRef){}

    @Input() trajet!:Station[]
    @Input() carbon!:number
    @Input() totalTime!:number
    @Output() stationChoice = new EventEmitter()

    transitionIndex:number[]= []
    transitionLine:string[] = []
    transition = ""
    prefix = "index"
    styleNumber:number = 0
    styleSheet = document.styleSheets[0] as CSSStyleSheet

    sendStationChoice(station:number){

        this.stationChoice.emit(station)
    }

    ngAfterViewInit(): void {

        this.styleNumber = this.styleSheet.cssRules.length
        
        this.colors.forEach((val,key)=>{


            if(this.elementRef.nativeElement.querySelector(`.${key}`) != null){

                this.setPseudoElementStyle(key,"before","background-color",val,true)
            }
        })


        this.transitionIndex.forEach((ele,index)=>{

            this.setPseudoElementStyle(this.prefix,ele.toString()+">.circle","width:18px !important; margin-right:5px !important;",
            `height:18px !important; border:5px solid white !important; background-color:${this.colors.get(this.transitionLine[index])} !important`,
            false)

            this.setPseudoElementStyle(this.prefix,ele.toString()+">.time","margin-right:8px !important","",false)
            this.setPseudoElementStyle(this.prefix,ele.toString()+">.name","font-size:large !important;",`font-weight:500 !important; color:${this.colors.get(this.transitionLine[index])} !important`,false)

            if(index != 0){

                this.setPseudoElementStyle(this.prefix+(ele-1),"::before","border-left: 4px dotted black !important; background-color:white !important;","width:2px !important;",false)

            }
        })

    }

    private setPseudoElementStyle(key: any, pseudoElement: string, style: string, value: string, marker:boolean) {

        if(marker){

            this.styleSheet.insertRule(
                `.${key}::${pseudoElement} { ${style}: ${value}; }`,
                this.styleSheet.cssRules.length
            )


            this.styleSheet.insertRule(

                `.${key}>.circle { border: 2px solid ${value}; }`,
                this.styleSheet.cssRules.length
            )
        
        }else{

            this.styleSheet.insertRule(
                `.${key}${pseudoElement} {${style}${value}}`,
                this.styleSheet.cssRules.length
            )
        }
      }

    ngOnInit(): void {

        this.trajet.forEach((ele,index)=>{

            if(this.transition != ele.line){

                this.transition = ele.line
                this.transitionIndex.push(index)
                this.transitionLine.push(ele.line)
            }
        })
    }

    ngOnDestroy(): void {


        for(let i = this.styleNumber; i < this.styleSheet.cssRules.length;){

            this.styleSheet.deleteRule(this.styleNumber)
        }

    }
}
