import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, of, throwError } from "rxjs";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        return next.handle(req).pipe(

            catchError((error: HttpErrorResponse) => {

                if (error.status === 500) {
                    
                    console.log('DataService error:', error);
                    
                    return of(null)
                }
                
                return of(error as any)
            })
        )
    }

    
}