import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Res, Station, Trajet } from '../model/models';

@Injectable({
  providedIn: 'root'
})

export class HttpRequestService {

    constructor(private httpclient: HttpClient) { }

    encoder = new TextEncoder()

    getTrajet(url:string, param:Trajet):Observable<Res>{

        const httpParam = new HttpParams()
        .set('start',btoa(String.fromCharCode(...this.encoder.encode(param.start))))
        .set('destination',btoa(String.fromCharCode(...this.encoder.encode(param.destination))))
        .set('time',btoa(String.fromCharCode(...this.encoder.encode(param.time))))
        .set('day', param.day)
        .set('reverse', param.reverse)

        return this.httpclient.get<Res>(url,{params:httpParam,responseType:"json"})
            .pipe(
                tap({
                    error(erro){
                        console.log(erro)
                    }
                })
            )
    }
}
