import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { bosses, items } from 'src/app/_db';
import { Boss, Item, Loot, Member, MongoId } from 'src/app/_models';
import { LootApiService } from 'src/app/_services/loot-api.service';

@Component({
  selector: 'app-dialog-distributable-details',
  templateUrl: './dialog-distributable-details.component.html',
  styleUrls: ['./dialog-distributable-details.component.css']
})
export class DialogViewAllComponent implements OnInit, AfterViewInit {

  isConfirmed: boolean = false;

  items: Item[] = items;
  bosses: Boss[] = bosses;
  lootMapping = this.lootApi.lootMapping;

  disableAnimation: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<DialogViewAllComponent>,
    public dialog: MatDialog,
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
      const distributable = lootMapping[lootMongoId._id].distributable;
      sum += distributable ? +distributable : 0;
    }
    return sum;
  }

  confirmClaim(): void {
    if (this.isConfirmed === false) {
      this.isConfirmed = true;
      return;
    }
    this.dialogRef.close(true);
  }

  getLoot(lootMongoId: MongoId): Loot {
    return this.lootMapping[lootMongoId._id];
  }

}
