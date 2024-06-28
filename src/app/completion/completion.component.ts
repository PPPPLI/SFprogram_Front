import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy,  Output,SimpleChanges } from '@angular/core';
import { LinesService } from '../service/lines.service';
import { Subscription } from 'rxjs';
import { CommonModule, SlicePipe } from '@angular/common';
import { Station } from '../model/models';

@Component({
  selector: 'app-completion',
  standalone: true,
  imports: [SlicePipe,CommonModule],
  templateUrl: './completion.component.html',
  styleUrl: './completion.component.css'
})
export class CompletionComponent implements AfterViewInit,OnDestroy, OnChanges{

    @Input() start!:any
    @Input() destination!:any
    @Input() unreachable!:string[]
    @Output() stationChoice = new EventEmitter()
    @Output() validation = new EventEmitter()


    subscriptor:Subscription = new Subscription()
    subscriptorCurrent:Subscription = new Subscription()
    subscriptorIcon:Subscription = new Subscription()
    localData: any
    stationMatch:string[] = []
    stationNames:string[] = []
    stations: string[] = []
    line:Array<Array<string>> = []

    current:any = {
        start:"",
        destination:""
    }
    cible:boolean = false
    iconMap!:Map<string,string>

    constructor(private data: LinesService){}

    select(index:number){

        
        if(!this.unreachable.includes(this.stations[index].slice(8))){

            this.cible?this.data.recouverCurrentChoice(this.stations[index].slice(8),true) :this.data.recouverCurrentChoice(this.stations[index].slice(8),false)
            this.stationChoice.emit([this.stations[index],this.cible])
            this.validation.emit(this.cible)
            this.stationMatch = []
            this.line = []
            this.stations = []
        }
    }

    ngOnChanges(changes: SimpleChanges): void {

        
        
        if(this.localData == null){

            this.subscriptor = this.data.isRecover$.subscribe(res=>{

                this.localData = res;
    
            })

            this.subscriptorCurrent = this.data.currentChoice$.subscribe(res=>{

                this.current = res
            })

            this.subscriptorIcon = this.data.iconMap$.subscribe(res=>{
                this.iconMap = res
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
        this.stations = []
        this.line = []
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

        let stationMark = Array(this.stationMatch.length).fill(0)


        for(let i = 0; i < stationMark.length; i++){

            if(stationMark[i] === 0){

                stationMark[i] = 1

                let linesForOneStation = []

                for(let k = i; k < this.stationMatch.length; k++){

                    if(this.stationMatch[i] === this.stationMatch[k]){

                        linesForOneStation.push(this.stationNames[k])
                        stationMark[k] = 1
                    }
                }

                this.line.push(linesForOneStation)
                this.stations.push(this.stationMatch[i])
            }
        }
    }

    

    ngAfterViewInit(): void { 

        if(this.localData ==null){

                this.subscriptor = this.data.isRecover$.subscribe(res=>{

                    this.localData = res;
            })
    
        
                this.subscriptorCurrent = this.data.currentChoice$.subscribe(res=>{
        
                    this.current = res
            })
    
                this.subscriptorIcon = this.data.iconMap$.subscribe(res=>{
        
                    this.iconMap = res
            })
        }


    }

    ngOnDestroy(): void {
        
        this.subscriptor.unsubscribe()
        this.subscriptorCurrent.unsubscribe()
        this.subscriptorIcon.unsubscribe()
    }

}
