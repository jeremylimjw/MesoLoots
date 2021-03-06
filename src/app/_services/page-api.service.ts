import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { handleError } from '../_common/httpErrorHandler';
import { Page } from '../_models';
import { SnackBarService } from './snack-bar.service';

interface PostPage {
  name: string;
  private: boolean;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class PageApiService {

  private page: Page | null = null;
  isLoading: boolean = false;

  constructor(private http: HttpClient, private snackBar: SnackBarService) { }

  initPage(name: string): Observable<Page> {
    this.isLoading = true;

    return new Observable(observer => {

      this.http.get(`${environment.baseUrl}/page?name=${name}`)
        .pipe(catchError(handleError))
        .subscribe(
          newPage => {
            if (Object.keys(newPage).length === 0) {
              this.snackBar.open(`${name} does not exist.`);
              observer.error(`${name} does not exist.`)
            } else {
              this.page = newPage as Page;
              observer.next()
              observer.complete();
            }
            this.isLoading = false;
          },
          err => {
            this.snackBar.open(err);
            observer.error(err);
            this.isLoading = false;
          }
        )

    })
  }

  createPage(page: PostPage): Observable<any> {
    return new Observable(observer => {

      this.http.post(`${environment.baseUrl}/page`, page)
        .pipe(catchError(handleError)).subscribe(
          result => {
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

  getPage(): Page | null {
    return this.page;
  }

  getPageId(): string | undefined {
    return this.page?._id;
  }

}
