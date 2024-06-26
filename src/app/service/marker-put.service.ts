import { Injectable} from '@angular/core';
import { Station } from '../model/models';
import L from 'leaflet';
import { LinesService } from './lines.service';

@Injectable({
  providedIn: 'root'
})
export class MarkerPutService{

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


    markerPositionCalculate(currentStation:Station,stationList:Station[],content:string,type:boolean){

        if(type){

            if(stationList.indexOf(currentStation) !== stationList.length-1){

                let nextStation = stationList[stationList.indexOf(currentStation)+1]
    
                if(currentStation.longitude > nextStation.longitude){
    
                    return L.divIcon({
        
                        className: 'text-labels-right',   
                        html: `<div style="text-align: left">${content}</div>`, 
                        iconSize: [100, 40], 
                        iconAnchor: [-15, 10] 
                    })
    
                }else{
    
                    return L.divIcon({
        
                        className: 'text-labels-left',
                        html: `<div style="text-align: right">${content}</div>`, 
                        iconSize: [100, 40], 
                        iconAnchor: [115, 10] 
                    })
                }
            }else{
    
                let previousStation = stationList[stationList.indexOf(currentStation)-1]
    
                if(currentStation.longitude > previousStation.longitude){
    
                    return L.divIcon({
        
                        className: 'text-labels-right',   
                        html: `<div style="text-align: left">${content}</div>`, 
                        iconSize: [100, 40], 
                        iconAnchor: [-15, 10] 
                    })
    
                }else{
    
                    return L.divIcon({
        
                        className: 'text-labels-left',   
                        html: `<div style="text-align: right">${content}</div>`, 
                        iconSize: [100, 40], 
                        iconAnchor: [115, 10] 
                    })
                }
            }
        }else{

            if(stationList.indexOf(currentStation) !== stationList.length-1){

                let nextStation = stationList[stationList.indexOf(currentStation)+1]
    
                if(currentStation.longitude > nextStation.longitude){
    
                    return L.divIcon({
        
                        className: 'text-labels-right',   
                        html: `<div style="text-align: left">${content}</div><div style="text-align: left">${currentStation.time.slice(0,5)}</div>`, 
                        iconSize: [100, 40], 
                        iconAnchor: [-15, 10] 
                    })
    
                }else{
    
                    return L.divIcon({
        
                        className: 'text-labels-left',
                        html: `<div style="text-align: right">${content}</div><div style="text-align: right">${currentStation.time.slice(0,5)}</div>`, 
                        iconSize: [100, 40], 
                        iconAnchor: [115, 10] 
                    })
                }
            }else{
    
                let previousStation = stationList[stationList.indexOf(currentStation)-1]
    
                if(currentStation.longitude > previousStation.longitude){
    
                    return L.divIcon({
        
                        className: 'text-labels-right',   
                        html: `<div style="text-align: left">${content}</div><div style="text-align: left">${currentStation.time.slice(0,5)}</div>`, 
                        iconSize: [100, 40], 
                        iconAnchor: [-15, 10] 
                    })
    
                }else{
    
                    return L.divIcon({
        
                        className: 'text-labels-left',   
                        html: `<div style="text-align: right">${content}</div><div style="text-align: right">${currentStation.time.slice(0,5)}</div>`, 
                        iconSize: [100, 40], 
                        iconAnchor: [115, 10] 
                    })
                }
            }
        }
    }

    putTimeMarker(stationList:Station[],totalTime:number,initialZoomLevel?:number,map?:L.Map){

        let station:Station = stationList[Number.parseInt((stationList.length/2).toString())]
        let linesOfTrajet:string[] = []
        let content = ""
        let zoomLevel = map!.getZoom()
        let newRadius= 100 * Math.pow(2, initialZoomLevel! - zoomLevel!)
        let correspondance:Station
        let marker:boolean = false
        let coordonnes:L.LatLngExpression

        stationList.forEach(ele=>{

            if(linesOfTrajet.indexOf(ele.line) === -1){

                if(marker){

                    correspondance = ele
                }

                linesOfTrajet.push(ele.line)
                marker = true
            }
        })

        if(linesOfTrajet.length === 1){

            coordonnes= [station.latitude,station.longitude]

        }else{

            coordonnes= [correspondance!.latitude, correspondance!.longitude]
        }

        linesOfTrajet.forEach(ele=>{
            
            content += `<img src="${this.iconMap.get(ele)}" alt="icon" height=18px>`
            content += `<span> > </span>`
        })

        content += `<span> | ${totalTime} minutes</span>`

        return  L.tooltip({
            content: `${content}`,
            direction:"auto",
            sticky:true
        }).setLatLng(coordonnes)
    }

}
