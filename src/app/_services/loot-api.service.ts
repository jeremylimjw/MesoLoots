import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { handleError } from '../_common/httpErrorHandler';
import { items } from '../_db';
import { Loot, Member, MongoId } from '../_models';
import { PageApiService } from './page-api.service';
import { SnackBarService } from './snack-bar.service';

export interface PostSellBody {
  pageId?: string;
  lootId: string;
  soldOn: Date;
  soldPrice: number;
  distributable: number;
}


@Injectable({
  providedIn: 'root'
})
export class LootApiService {

  lootMapping: { [key: string]: Loot } = {};
  lootTableDataSource = new MatTableDataSource<Loot>();

  constructor(
    private http: HttpClient, 
    private pageApi: PageApiService, 
    private snackBar: SnackBarService) {

      /** Store mapping dictionary of loots. */
      for (let loot of this.loots) {
        this.lootMapping[loot._id!] = loot;
      }

    }

  get loots(): Loot[] {
    return this.pageApi.getPage()?.loots || [];
  }

  createLoots(loots: Loot[]): Observable<any> {
    const body = {
      pageId: this.pageApi.getPageId(),
      loots: loots
    }

    return new Observable(observer => {

      this.http.post(`${environment.baseUrl}/loot`, body)
        .pipe(catchError(handleError))
        .subscribe(
          newLoots => {
            for (let loot of newLoots as Loot[]) {
              this.loots.push(loot);
              this.lootMapping[loot._id!] = loot; // Update loot mapping.
            }
            this.lootTableDataSource.data = this.loots;
            
            this.snackBar.open("Loots successfully added.");
            observer.next(newLoots);
            observer.complete();
          },
          err => {
            this.snackBar.open(err);
            observer.error(err);
          }
        )

    })
  }

  sellLoot(body: PostSellBody): Observable<any> {
    body.pageId = this.pageApi.getPageId();

    return new Observable(observer => {

      this.http.post(`${environment.baseUrl}/loot/sell`, body)
        .pipe(catchError(handleError))
        .subscribe(
          result => {
            const newLoot = result as Loot;
            if (this.lootMapping[newLoot._id!]) {
              this.lootMapping[newLoot._id!].soldOn = newLoot.soldOn;
              this.lootMapping[newLoot._id!].soldPrice = newLoot.soldPrice;
              this.lootMapping[newLoot._id!].distributable = newLoot.distributable;
            }
            this.lootTableDataSource.data = this.loots;

            /** Add to member's distributable. */
            for (let memberMongoId of newLoot.party) {
              this.addToDistributable(memberMongoId, newLoot);
            }
            
            this.snackBar.open(`${items[newLoot.itemId].name} successfully updated.`);
            observer.next(newLoot);
            observer.complete();
          },
          err => {
            this.snackBar.open(err);
            observer.error(err);
          }
        )

    })
  }

  claimLoot(member: Member): Observable<any> {
    const pageId = this.pageApi.getPageId();

    return new Observable(observer => {

      this.http.post(`${environment.baseUrl}/loot/claim`, { pageId: pageId, memberId: member._id })
        .pipe(catchError(handleError))
        .subscribe(
          () => {
            member.claimedLoots = member.claimedLoots.concat(member.distributableLoots);
            member.distributableLoots = [];
            
            this.snackBar.open(`${member.name} loots has been distributed.`);
            observer.next();
            observer.complete();
          },
          err => {
            this.snackBar.open(err);
            observer.error(err);
          }
        )

    })
  }

  deleteLoot(loot: Loot): Observable<any> {
    const body = {
      pageId: this.pageApi.getPageId(),
      lootId: loot._id
    }

    return new Observable(observer => {

      this.http.delete(`${environment.baseUrl}/loot?pageId=${body.pageId}&lootId=${body.lootId}`)
        .pipe(catchError(handleError))
        .subscribe(
          result  => {
            this.loots.splice(this.loots.indexOf(loot), 1);
            delete this.lootMapping[loot._id!]; // Update loot mapping.
            this.lootTableDataSource.data = this.loots;

            /** Remove all dependencies. */
            for (let member of loot.party) {
              this.removeFromDistributable(member, loot);
              this.removeFromClaimed(member, loot);
            }

            this.snackBar.open("Loot successfully removed.");
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

  /** Add loot id to member's claimedLoots. */
  addToDistributable(member: MongoId, loot: Loot): void {
    this.pageApi.getPage()?.team.find(m => member._id === m._id)?.distributableLoots?.push({ _id: loot._id! });
  }

  /** Remove loot id from member distributables if present. */
  removeFromDistributable(member: MongoId, loot: Loot): void {
    const distributableLoots = this.pageApi.getPage()?.team.find(m => member._id === m._id)?.distributableLoots || [];
    for (let i = 0; i < distributableLoots.length; i++) {
      if (distributableLoots[i]._id === loot._id) {
        distributableLoots.splice(i, 1);
        break;
      }
    }
  }

  /** Add loot id to member's claimedLoots. */
  addToClaimed(member: MongoId, loot: Loot): void {
    this.pageApi.getPage()?.team.find(m => member._id === m._id)?.claimedLoots?.push({ _id: loot._id! });
  }

  /** Remove loot id from member distributables if present. */
  removeFromClaimed(member: MongoId, loot: Loot): void {
    const claimedLoots = this.pageApi.getPage()?.team.find(m => member._id === m._id)?.claimedLoots || [];
    for (let i = 0; i < claimedLoots.length; i++) {
      if (claimedLoots[i]._id === loot._id) {
        claimedLoots.splice(i, 1);
        break;
      }
    }
  }

  resetLootTableDataSource(): void {
    this.lootTableDataSource = new MatTableDataSource<Loot>();
  }
  
}
