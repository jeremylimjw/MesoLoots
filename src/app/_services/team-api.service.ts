import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { handleError } from '../_common/httpErrorHandler';
import { Member } from '../_models';
import { PageApiService } from './page-api.service';
import { SnackBarService } from './snack-bar.service';

interface MemberPost {
  name: string;
  pageId: string;
  jobId: number;
}

@Injectable({
  providedIn: 'root'
})
export class TeamApiService {

  constructor(
    private http: HttpClient, 
    private pageApi: PageApiService,
    private snackBar: SnackBarService) { }

  get team(): Member[] {
    return this.pageApi.getPage()?.team || [];
  }

  createMember(member: MemberPost): Observable<any> {
    return new Observable(observer => {

      this.http.post(`${environment.baseUrl}/member`, member)
        .pipe(catchError(handleError))
        .subscribe(
          newMember => {
            this.team.push(newMember as Member);
            this.snackBar.open("Member successfully added.");
            observer.next(newMember as Member);
            observer.complete();
          },
          err => {
            this.snackBar.open(err);
            observer.error(err);
          }
        )

    })
  }

  deleteMember(member: Member): Observable<any> {
    return new Observable(observer => {

      this.http.delete(`${environment.baseUrl}/member?pageId=${this.pageApi.getPageId()}&memberId=${member._id}`)
        .pipe(catchError(handleError))
        .subscribe(
          result  => {
            member.isDeleted = true;
            this.snackBar.open("Member successfully removed.");
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
