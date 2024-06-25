import { Injectable } from '@angular/core';
import { Station } from '../model/models';
import L from 'leaflet';
import { SlicePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MarkerPutService{

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
}
