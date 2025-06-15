import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const csrfToken = this.getCookie('XSRF-TOKEN');
    
    if (csrfToken && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      const cloned = req.clone({
        headers: req.headers.set('x-xsrf-token', csrfToken)
      });
      return next.handle(cloned);
    }
    
    return next.handle(req);
  }

  private getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }
}
