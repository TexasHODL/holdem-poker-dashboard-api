import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof Array) {
          return {
            result: data,
          };
        }
        return {
          ...data,
          result: data ? data.result || data : null,
          // info: data.info ? data.info || data : null,
          totalRake: data && data.totalRake ? data.totalRake : null,
          totalAmount: data && data.totalAmount ? data.totalAmount : null,
          success: true,
        };
      }),
    );
  }
}
