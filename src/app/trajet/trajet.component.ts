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

    colors!:Map<string,string>
    iconMap!:Map<string,string>
    subscriptorColor:Subscription = new Subscription()
    subscriptorIcon:Subscription = new Subscription()
    
    constructor(private lineService:LinesService, private elementRef:ElementRef){}

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

        this.subscriptorColor = this.lineService.colorMap$.subscribe(res=>{

            this.colors = res
        })

        this.subscriptorIcon = this.lineService.iconMap$.subscribe(res=>{

            this.iconMap = res
        })
    }

    ngOnDestroy(): void {


        for(let i = this.styleNumber; i < this.styleSheet.cssRules.length;){

            this.styleSheet.deleteRule(this.styleNumber)
        }

        this.subscriptorColor.unsubscribe()
        this.subscriptorIcon.unsubscribe()

    }
}
