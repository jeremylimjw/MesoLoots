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
export class AuthService {

  constructor(
    private http: HttpClient, 
    private pageApi: PageApiService, 
    private snackBar: SnackBarService) { }

  /** Set hashed password as cookie that expires on session end. */
  setCookie(pageId: string | undefined, hashedPassword: string): void {
    if (pageId) {
      document.cookie = `${pageId}=${hashedPassword}`;
    }
  }

  /** Retrieve all cookies as an object. */
  getCookies(): any {
    return document.cookie.split(';')
      .map(cookies => cookies.split('='))
      .reduce((prev, [key, value]) => {
        return { ...prev, [key.trim()]: decodeURIComponent(value)}
      }, {})
  }

  /** Retrieve hashed password from cookies. */
  getHashedPassword(): string | undefined {
    return this.getCookies()[`${this.pageApi.getPageId()}`];
  }

  /** Verify password and return hashed password. */
  login(password: string): Observable<any> {
    const body = {
      pageId: this.pageApi.getPageId(),
      password: password
    }

    return new Observable(observer => {

      this.http.post(`${environment.baseUrl}/auth`, body)
        .pipe(catchError(handleError))
        .subscribe(
          (result: any) => {
            this.setCookie(this.pageApi.getPageId(), result.hashedPassword);

            this.snackBar.open("Logged in successfully.");
            observer.next(result);
            observer.complete();
          },
          err => {
            if (err.status !== 401) {
              this.snackBar.open(err);
            }
            observer.error(err);
          }
        )

    })
  }

  /** Remove cookie. */
  removeCookie(): void {
    if (this.pageApi.getPageId()) {
      document.cookie = `${this.pageApi.getPageId()}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    }
  }

  /** Moved from pageApi.service to auth.service to prevent circular dependency. */
  deletePage(): Observable<any> {
    return new Observable(observer => {

      this.http.delete(`${environment.baseUrl}/page?id=${this.pageApi.getPageId()}`,
        { headers: { authorization: `Bearer ${this.getHashedPassword()}` } }
      )
        .pipe(catchError(handleError))
        .subscribe(
          result  => {
            this.snackBar.open("Page successfully deleted.");
            observer.next(result);
            observer.complete();
          },
          err => {
            console.log(err)
            if (err.status === 401) {
              this.snackBar.open('Unauthorized. Password may have been changed. Logging out..');
              this.removeCookie();
            } else {
              this.snackBar.open(err);
            }
            observer.error(err);
          }
        )

    })
  }

  /** Returns a boolean if user has password cookie and the page is private. */
  isAllowedToEdit(): boolean {
    const allowed = this.pageApi.getPage()?.private === false || this.getHashedPassword() != null;
    if (!allowed) {
      this.snackBar.open("This page is private. Unlock with the password to have edit rights.");
    }
    return allowed;
  }
}
