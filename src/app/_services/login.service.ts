import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { handleError } from '../_common/httpErrorHandler';
import { PageApiService } from './page-api.service';
import { SnackBarService } from './snack-bar.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  isLoggedIn: boolean = false;

  constructor(
    private http: HttpClient, 
    private pageApi: PageApiService, 
    private snackBar: SnackBarService) { }

  /** Set visited cookie to true that expires on midnight. */
  setCookie(password: string): void {
    const now = new Date();
    now.setHours(24,0,0,0);
    document.cookie = `test2=${password}; domain=localhost`;
  }

  /** Retrieve all cookies as an object. */
  getCookies(): any {
    return document.cookie.split(';')
      .map(cookies => cookies.split('='))
      .reduce((prev, [key, value]) => {
        return { ...prev, [key.trim()]: decodeURIComponent(value)}
      }, {})
  }

  login(password: string): Observable<any> {
    const body = {
      pageId: this.pageApi.getPageId(),
      password: password
    }

    return new Observable(observer => {

      this.http.post(`${environment.baseUrl}/auth`, body, { headers: { asd : 'qwe' } , withCredentials: true })
        .pipe(catchError(handleError))
        .subscribe(
          result => {

            console.log('my cookies:')
            console.log(this.getCookies())

            this.snackBar.open("Logged in successfully.");
            observer.next(result);
            observer.complete();
          },
          err => {
            this.snackBar.open(err);
            observer.error(err);
          }
        )

    })
  }
}
