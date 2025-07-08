import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from './http.service';

export interface HealthStatus {
    status: string;
    timestamp: string;
    mongodb: string;
    environment: string;
}

export interface DetailedHealthStatus {
    status: string;
    timestamp: string;
    environment: string;
    mongodb: {
        status: string;
        connectionString: string;
        database: string;
    };
    redis: {
        status: string;
        connectionString: string;
    };
}

@Injectable({
    providedIn: 'root'
})
export class HealthService {
    constructor(private httpService: HttpService) { }

    checkHealth(): Observable<HealthStatus> {
        return this.httpService.get<HealthStatus>('/health').pipe(
            map(response => response.data!)
        );
    }

    checkDetailedHealth(): Observable<DetailedHealthStatus> {
        return this.httpService.get<DetailedHealthStatus>('/health/detailed').pipe(
            map(response => response.data!)
        );
    }
} 