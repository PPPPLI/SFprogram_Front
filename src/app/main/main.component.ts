import { Component, OnChanges, OnDestroy, OnInit} from '@angular/core';
import * as L from 'leaflet';
import { LinesService } from '../service/lines.service';
import { Subscription } from 'rxjs';
import { FormBuilder,FormsModule,ReactiveFormsModule, Validators,} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Station, Trajet } from '../model/models';
import { HttpRequestService } from '../service/http-request.service';
import { TrajetComponent } from '../trajet/trajet.component';
import { timeCalculatorService } from '../service/timeCalculate.service';
import { CompletionComponent } from '../completion/completion.component';
import { MarkerPutService } from '../service/marker-put.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,FormsModule,TrajetComponent,CompletionComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit,OnDestroy{

    constructor(private lines:LinesService, private formBuilder: FormBuilder, private getRequest: HttpRequestService,
        private timecaculator:timeCalculatorService, private markerputService:MarkerPutService
    ){}

    semaine = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"]
    globalData:any
    carbon: number = 0
    lineMarker:String = "init"
    isFirstStation:boolean = true
    lastStation!:[number,number]
    preStation:Station = {

        name:"",
        accessible:false,
        latitude:0,
        longitude:0,
        line:"",
        time:""
    }
    initialZoomLevel?:number
    totalTime = 0
    validationDepart = false
    validationArrival = false

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
    map?:L.Map
    stationNames?:Array<String>
    metroLines = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
    trajetStations:Station[] = []
    count = 0
    lineFeature:L.FeatureGroup = L.featureGroup()
    circlesFeature:L.FeatureGroup = L.featureGroup()
    segmentsFeature:L.FeatureGroup = L.featureGroup()
    markerFeature: L.FeatureGroup = L.featureGroup()
    subscrib:Subscription = new Subscription;
    stylesheet = document.styleSheets[0] as CSSStyleSheet
    styleIndex!:number

    data:Trajet = {
        
        start: "",
        destination:"",
        time: "",
        day: 0,
        reverse : false
    } 
    trajet:any = []
    localTime = new Date()

    formData = this.formBuilder.group({

        start : ["", Validators.required],
        destination : ["",Validators.required],
        start_time: [  `${this.localTime.getHours().toString().padStart(2,"0")}:${this.localTime.getMinutes().toString().padStart(2,"0")}`,Validators.required],
        day: [this.localTime.getDay() != 0? String(this.localTime.getDay()-1):String(6),Validators.required],
        reverse:[0,Validators.required]
    })

    completer(data:any){

        if(data[1]){
            this.formData.patchValue({destination: data[0].slice(8)})
        }else{
            this.formData.patchValue({start: data[0].slice(8)})
        }
    }

    validate(data?:any){

        if(typeof data == "boolean"){

            data?this.validationArrival = true:this.validationDepart = true
        }
        
        if(this.validationArrival && this.validationDepart){

            this.print()
        }
    }

    reverse(){
        
        let formInfo = this.formData.value;
        this.isFirstStation = true
        this.stylesheet.deleteRule(this.styleIndex)

        if(formInfo.start != "" || formInfo.destination != ""){
            
            let temp = formInfo.start
            formInfo.start = formInfo.destination
            formInfo.destination = temp


            this.formData.patchValue({

                start:formInfo.start,
                destination:formInfo.destination
            })
        }

        this.validate()
    }

    print(){

            this.trajetStations = []

            let formInfo = this.formData.value;
            this.data.start = formInfo.start!
            this.data.destination = formInfo.destination!
            this.data.time = formInfo.start_time!
            this.data.day = Number.parseInt(formInfo.day!)
            this.data.reverse = formInfo.reverse == 0? false:true

            this.getRequest.getTrajet("/find",this.data).subscribe(res=>{

                this.carbon = Number.parseFloat(res.carbone)

                res.path.forEach(ele=>{

                    let stationInfos:string[] = this.globalData[ele.line].split("}")
                    stationInfos.forEach(station=>{

                        if(station.includes(ele.name)){

                            ele.latitude = Number.parseFloat(station.substring(station.indexOf("latitude")+11,station.length-1))
                            ele.longitude = Number.parseFloat(station.substring(station.indexOf("longitude")+12,station.indexOf("latitude")-3))
                            this.trajetStations.push(ele)
                        }
                        
                    })
                })

                this.totalTime = this.timecaculator.calculator(this.trajetStations[0].time,this.trajetStations[this.trajetStations.length-1].time)


                this.styleIndex = this.stylesheet.cssRules.length

                this.showtrajet(this.trajetStations,true)
                let tooltip = this.markerputService.putTimeMarker(this.trajetStations,this.totalTime)
                this.circlesFeature.addLayer(tooltip)
            })
    }


    showtrajet(data:any, isTrajet:boolean){


        if(this.map?.hasLayer(this.circlesFeature)){

            this.map?.removeLayer(this.circlesFeature)
            this.map?.removeLayer(this.segmentsFeature)
            this.circlesFeature.clearLayers()
            this.segmentsFeature.clearLayers()
            this.trajet = []
            this.lineMarker = "init"
            this.isFirstStation = true
        }
        
        if(isTrajet){

            this.circlesFeature.addTo(this.map!)
            this.segmentsFeature.addTo(this.map!)

        }else{

            this.lineFeature = L.featureGroup().addTo(this.map!)
        }

        if(isTrajet){

            data.forEach((ele:Station)=>{

                this.addStationNodes(data,ele,ele.name,isTrajet)
            })
            
            let polyline1 = L.polyline(this.trajet, {color: this.colors.get(this.lineMarker as string), weight:5, fillColor:this.colors.get(this.lineMarker as string)})
            let polyline2 = L.polyline(this.trajet, {color: "black",weight:9})
    
            let icon = this.markerputService.markerPositionCalculate(data[data.length-1],data,data[data.length-1].name,true)

            let icon_start = L.icon({

                iconUrl:"../../assets/img/localisation.png",
                iconSize:[35,35],
                iconAnchor:[17.5,33],
                
            })
            this.circlesFeature.addLayer(L.marker(this.trajet[this.trajet.length-1],{
                icon:icon_start
            }))
            
            this.circlesFeature.addLayer(L.marker(this.trajet[this.trajet.length-1],{icon:icon}))
            let zoomLevel = this.map?.getZoom()
            let newRadius= 100 * Math.pow(2, this.initialZoomLevel! - zoomLevel!)
    
            this.circlesFeature.addLayer(L.circle(this.trajet[this.trajet.length-1],{radius:newRadius, 
                
                fillColor:"white", 
                fill:true,
                weight:3,
                color:"black",
                fillOpacity:1})).setZIndex(50)
    
            this.segmentsFeature.addLayer(polyline1).bringToBack()
            this.segmentsFeature.addLayer(polyline2).bringToBack()
            
            this.map!.fitBounds(this.segmentsFeature.getBounds(),{maxZoom:18,padding:[30,0]});
        }
        
    }

    addStationNodes(ele:any,stationInfos:any,name:String,isTrajet:boolean) {

        let icon = this.markerputService.markerPositionCalculate(stationInfos,ele,stationInfos.name,true)
        let zoomLevel = this.map?.getZoom()
        let newRadius= 100 * Math.pow(2, this.initialZoomLevel! - zoomLevel!)
        let newTransitionRadius = 60 * Math.pow(2, this.initialZoomLevel! - zoomLevel!)

        if(this.isFirstStation){
    
            this.circlesFeature.addLayer(L.marker([stationInfos.latitude,stationInfos.longitude],{icon:icon}))

    
            this.circlesFeature.addLayer(L.circle([stationInfos.latitude,stationInfos.longitude],
                {
                    radius:newRadius,
                    fillColor:"white", 
                    fill:true,
                    weight:3,
                    color:"black",
                    fillOpacity:1}))

            this.isFirstStation = false
            this.trajet.push([stationInfos.latitude,stationInfos.longitude])
        }


        else if((this.lineMarker === "init" || this.lineMarker === stationInfos.line) && this.preStation.name != stationInfos.name){

            this.trajet.push([stationInfos.latitude,stationInfos.longitude])
            this.lineMarker = stationInfos.line
            this.preStation = stationInfos
            
        }else{

            icon = this.markerputService.markerPositionCalculate(this.preStation,ele,this.preStation.name,true)

            this.circlesFeature.addLayer(L.marker([this.preStation.latitude,this.preStation.longitude],{icon:icon}))
            this.circlesFeature.addLayer(L.circle([this.preStation.latitude,this.preStation.longitude],{
                
                radius:newTransitionRadius,
                fillColor:"white", 
                fill:true,
                weight:2,
                color:"black",
                fillOpacity:1
            }))
            
            let polyline1 = L.polyline(this.trajet, {color: this.colors.get(this.preStation.line as string),weight:5,opacity:1})
            let polyline2 = L.polyline(this.trajet, {color: "black",weight:9})
            let transition = L.polyline([[this.preStation.latitude,this.preStation.longitude],[stationInfos.latitude,stationInfos.longitude]], {color: "black", weight:4,dashArray:[10]})
            this.segmentsFeature.addLayer(polyline1)
            this.segmentsFeature.addLayer(polyline2)
            this.segmentsFeature.addLayer(transition)
            this.trajet = []
            this.trajet.push([stationInfos.latitude,stationInfos.longitude])
            this.lineMarker = stationInfos.line
        }
    }

    clearList(data:number){

        if(this.trajetStations.length != 0){

            data == 1? this.validationDepart = false:this.validationArrival = false
            this.trajetStations = []
            this.map?.removeLayer(this.circlesFeature)
            this.map?.removeLayer(this.segmentsFeature)
            this.circlesFeature.clearLayers()
            this.segmentsFeature.clearLayers()
            this.trajet = []
            this.lineMarker = "init"
            this.isFirstStation = true
            this.stylesheet.deleteRule(this.styleIndex)
        }

    }

    displayStation(data:number){

        if(data === -1){

            this.markerFeature.clearLayers()
        }else{

            if(!this.map?.hasLayer(this.markerFeature)){

                this.map?.addLayer(this.markerFeature)
            }
    
            this.markerFeature.clearLayers()
    
            let station:Station = this.trajetStations[data]
    
            let icon = this.markerputService.markerPositionCalculate(station,this.trajetStations,station.name,false)
    
            this.markerFeature.addLayer(L.marker([station.latitude,station.longitude],{icon:icon}))
            let zoomLevel = this.map?.getZoom()
            let newRadius= 100 * Math.pow(2, this.initialZoomLevel! - zoomLevel!)
    
            this.markerFeature.addLayer(L.circle([station.latitude,station.longitude],{radius:newRadius,
                fillColor:"white", 
                fill:true,
                weight:3,
                color:"black",
                fillOpacity:1
            })).setZIndex(1)

        }


    }

    ngOnInit(): void {
     
        this.map = L.map('map',{
            maxZoom:20,
            zoomDelta:0.5
        }).setView([48.85434, 2.3469],13).setMaxZoom(18)

        this.initialZoomLevel = this.map?.getZoom()
        
        this.map?.on('zoom',() =>{

            
            let zoomLevel = this.map?.getZoom()
            let newRadius= 100 * Math.pow(2, this.initialZoomLevel! - zoomLevel!)

            

            this.circlesFeature.eachLayer((layer)=>{

                if(layer instanceof L.Circle){

                    layer.setRadius(newRadius)
                }
            })
        })

        L.tileLayer("https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=df4UUB9TxscrofQiSX8U",{
            tileSize:512,
            zoomOffset: -1,
            maxZoom: 20,
            minZoom: 10,
            crossOrigin:true}).addTo(this.map);


        
        this.subscrib = this.lines.isRecover$.subscribe(data=>{

            this.globalData = data
        })
    }

    ngOnDestroy(): void {
        
        this.subscrib.unsubscribe()
    }
}
