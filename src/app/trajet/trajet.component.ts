import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
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
export class TrajetComponent implements OnInit,OnDestroy{
    
    constructor(private data:LinesService){}

    @Input() trajet!:Station[]
    @Input() carbon!:number
    @Input() totalTime!:number
    @Output() stationChoice = new EventEmitter()

    subscriber: Subscription = new Subscription()

    sendStationChoice(station:number){

        this.stationChoice.emit(station)
    }

    ngOnInit(): void {
        
        this.subscriber = this.data.isRecover$.subscribe(res =>{

            
        })

    }

    ngOnDestroy(): void {
        
        this.subscriber.unsubscribe()
    }
}
