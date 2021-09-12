import { DecimalPipe } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { bosses, items } from 'src/app/_db';
import { Boss, Item, Loot, Member, MongoId } from 'src/app/_models';
import { LootApiService } from 'src/app/_services/loot-api.service';

@Component({
  selector: 'app-dialog-view-all',
  templateUrl: './dialog-view-all.component.html',
  styleUrls: ['./dialog-view-all.component.css']
})
export class DialogViewAllComponent implements OnInit, AfterViewInit {

  items: Item[] = items;
  bosses: Boss[] = bosses;
  lootMapping = this.lootApi.lootMapping;

  disableAnimation: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<DialogViewAllComponent>,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar, 
    private lootApi: LootApiService,
    @Inject(MAT_DIALOG_DATA) public member: Member) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.disableAnimation = false);
  }

  getTotalDistributableOf(member: Member): number {
    const lootMapping = this.lootApi.lootMapping;
    let sum = 0;
    for (let lootMongoId of member.distributableLoots) {
      sum += lootMapping[lootMongoId._id].distributable || 0;
    }
    return sum;
  }

  claim(): void {
    this._snackBar.open("This feature is still a work in progress.", "Dismiss", { duration: 5000 });
    // if (!this.distributable.member) return;
    
    // const distributable = this.lootService.getDistributableOf(this.distributable.member);
    // if (!distributable || distributable?.loots.length === 0) {
    //   this._snackBar.open("Nothing to claim.", "Close", { duration: 5000 });
    //   return;
    // }
    
    // const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    //   maxWidth: "400px",
    //   data: { 
    //     title: `Confirm claim for ${this.distributable.member.name}`, 
    //     message: `Has ${this.distributable.member.name} received ${new DecimalPipe('en-SG').transform(this.getTotalDistributable(), '1.0')} mesos?`}
    // });

    // dialogRef.afterClosed().subscribe(dialogResult => {
    //   if (dialogResult && this.distributable.member) {
    //     this.lootService.claimDistributable(this.distributable.member);
    //     this._snackBar.open("Claim successfully updated.", "Close", { duration: 5000 });
    //   }
    // });
  }

  getLoot(lootMongoId: MongoId): Loot {
    return this.lootMapping[lootMongoId._id];
  }

}
