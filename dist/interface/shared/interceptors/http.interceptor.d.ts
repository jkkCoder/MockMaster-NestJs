import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class HttpInterceptor implements NestInterceptor {
    private readonly config;
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
