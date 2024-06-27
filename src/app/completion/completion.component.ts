import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy,  Output,SimpleChanges } from '@angular/core';
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
    subscriptorIcon:Subscription = new Subscription()
    localData: any
    stationMatch:string[] = []
    stationNames:string[] = []
    current:any = {
        start:"",
        destination:""
    }
    cible:boolean = false
    iconMap!:Map<string,string>

    constructor(private data: LinesService){}

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
