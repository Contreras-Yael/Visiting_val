import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PassService {
  private API_URL = 'http://localhost:3000/api/passes';
  constructor(private http: HttpClient) { }

  createPass(guestName: string, hostId: string): Observable<any> {
    return this.http.post(this.API_URL, { guestName, hostId });
  }

  validatePass(code: string): Observable<any> {
    return this.http.get(`${this.API_URL}/validate/${code}`);
  }

  usePass(code: string): Observable<any> {
    return this.http.patch(`${this.API_URL}/use/${code}`, {});
  }

  getHourlyStats(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/api/stats/hourly-flow');
  }

  getStats(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/api/stats/status-distribution');
  }
}

