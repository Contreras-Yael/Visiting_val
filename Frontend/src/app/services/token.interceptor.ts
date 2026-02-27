import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  auth_token = "123456789";

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const tokenizedReq = request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.auth_token}`
      }
    })

//REVISION NO LO COMPRENDO EN SU TOTALIDAD,
//PERO SE QUE ES PARA REINTENTAR LA PETICION EN CASO DE FALLAR,
//LO INVESTIGARE MAS A FONDO
    return next.handle(tokenizedReq).pipe(
      retry(3), // Retry up to 3 times
      catchError((err: HttpErrorResponse) => {
        console.log('Error en la petición HTTP:');
        return throwError(err.message)
      })
    );
  }
}
