import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, SimpleChanges } from '@angular/core';
import { LinesService } from '../service/lines.service';
import { Subscription } from 'rxjs';
import { SlicePipe } from '@angular/common';
import { Station } from '../model/models';

@Component({
  selector: 'app-completion',
  standalone: true,
  imports: [SlicePipe],
  templateUrl: './completion.component.html',
  styleUrl: './completion.component.css'
})
export class CompletionComponent implements AfterViewInit,OnDestroy, OnChanges{

    @Input() start!:any
    @Input() destination!:any
    @Output() stationChoice = new EventEmitter()
    @Output() validation = new EventEmitter()


    subscriptor:Subscription = new Subscription()
    subscriptorCurrent:Subscription = new Subscription()
    localData: any
    stationMatch:string[] = []
    stationNames:string[] = []
    current:any
    cible:boolean = false
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

    constructor(private data: LinesService, private render: Renderer2, private selector: ElementRef){}

    select(index:number){

        this.cible?this.data.recouverCurrentChoice(this.stationMatch[index].slice(8),true) :this.data.recouverCurrentChoice(this.stationMatch[index].slice(8),false)
        this.stationChoice.emit([this.stationMatch[index],this.cible])
        this.validation.emit(this.cible)
        this.stationMatch = []
    }

    ngOnChanges(changes: SimpleChanges): void {

        if(this.localData == null){

            this.subscriptor = this.data.isRecover$.subscribe(res=>{

                this.localData = res;
  
            })

            this.subscriptorCurrent = this.data.currentChoice$.subscribe(res=>{

                this.current = res
            })
        }

        if(changes["start"] || changes["destination"]){

            if(this.destination !== "" && changes['destination'] != null && (changes['destination'].currentValue != this.current.destination)){

                this.search(this.destination)
                this.cible = true

            }else if(this.start !== "" && changes['start'] != null && (changes['start'].currentValue != this.current.start)){
                this.search(this.start);
                this.cible = false
    
            }else{
    
                this.stationMatch = []
            }
        }
    }

    search(value:string){

        this.stationMatch = []
        this.stationNames = []
        let reg:RegExp

        reg = new RegExp("\"name\":\"" +value+'[^"]+',"gi")
        
        Object.keys(this.localData).forEach(key=>{
                

            let res = this.localData[key].match(reg)

            if(res != null){

                res.forEach(() =>{

                    this.stationNames.push(key)
                })

                this.stationMatch = this.stationMatch.concat(res)
            }
        })
    }

    

    ngAfterViewInit(): void { 

        this.subscriptor = this.data.isRecover$.subscribe(res=>{

            this.localData = res;
            
        })

        this.subscriptorCurrent = this.data.currentChoice$.subscribe(res=>{

            this.current = res
        })
    }

    ngOnDestroy(): void {
        
        this.subscriptor.unsubscribe()
        this.subscriptorCurrent.unsubscribe()
    }

}
