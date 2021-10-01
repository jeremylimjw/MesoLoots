import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { handleError } from '../_common/httpErrorHandler';
import { Member } from '../_models';
import { AuthService } from './auth.service';
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

  teamMapping: { [key: string]: Member } = {};

  constructor(
    private http: HttpClient, 
    private pageApi: PageApiService,
    private snackBar: SnackBarService,
    private authService: AuthService) { 

      /** Store mapping dictionary of members. */
      for (let member of this.team) {
        this.teamMapping[member._id] = member;
      }
    }

  get team(): Member[] {
    return this.pageApi.getPage()?.team || [];
  }

  createMember(member: MemberPost): Observable<any> {
    return new Observable(observer => {

      this.http.post(`${environment.baseUrl}/member`, member,
        { headers: { authorization: `Bearer ${this.authService.getHashedPassword()}` } }
      )
        .pipe(catchError(handleError))
        .subscribe(
          newMember => {
            const member = newMember as Member;
            this.team.push(member);
            this.teamMapping[member._id!] = member; // Update team mapping.
            this.snackBar.open("Member successfully added.");
            observer.next(member);
            observer.complete();
          },
          err => {
            if (err.status === 401) {
              this.authService.removeCookie();
              this.snackBar.open('Unauthorized. Password may have been changed. Logging out..');
            } else {
              this.snackBar.open(err);
            }
            observer.error(err);
          }
        )

    })
  }

  deleteMember(member: Member): Observable<any> {
    return new Observable(observer => {

      this.http.delete(`${environment.baseUrl}/member?pageId=${this.pageApi.getPageId()}&memberId=${member._id}`,
        { headers: { authorization: `Bearer ${this.authService.getHashedPassword()}` } }
      )
        .pipe(catchError(handleError))
        .subscribe(
          result  => {
            this.team.splice(this.team.findIndex(x => x._id === member._id), 1);
            delete this.teamMapping[member._id]; // Update team mapping.
            this.snackBar.open("Member successfully removed.");
            observer.next(result);
            observer.complete();
          },
          err => {
            if (err.status === 401) {
              this.authService.removeCookie();
              this.snackBar.open('Unauthorized. Password may have been changed. Logging out..');
            } else {
              this.snackBar.open(err);
            }
            observer.error(err);
          }
        )

    })
  }

}
