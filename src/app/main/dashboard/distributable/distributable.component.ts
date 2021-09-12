import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from 'src/app/_common/confirm-dialog/confirm-dialog.component';
import { Member } from 'src/app/_models';
import { LootApiService } from 'src/app/_services/loot-api.service';
import { TeamApiService } from 'src/app/_services/team-api.service';
import { DialogViewAllComponent } from './dialog-view-all/dialog-view-all.component';

@Component({
  selector: 'app-distributable',
  templateUrl: './distributable.component.html',
  styleUrls: ['./distributable.component.css']
})
export class DistributableComponent implements OnInit {

  team: Member[] = this.teamApi.team;
  deletingId: string = '';

  constructor(
    private teamApi: TeamApiService,
    private lootApi: LootApiService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    ) { }

  ngOnInit(): void {
  }

  hasAnyDistributables(): boolean {
    for (let member of this.team) {
      if (member.distributableLoots.length > 0) {
        return true;
      }
    }
    return false;
  }

  getTotalDistributableOf(member: Member): number {
    const lootMapping = this.lootApi.lootMapping;
    let sum = 0;
    for (let lootMongoId of member.distributableLoots) {
      sum += lootMapping[lootMongoId._id].distributable || 0;
    }
    return sum;
  }

  claim(member: Member): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: { 
        title: `Confirm claim for ${member.name}`, 
        message: `Has ${member.name} received ${new DecimalPipe('en-SG').transform(this.getTotalDistributableOf(member), '1.0')} mesos?`
      }
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {

        this.deletingId = member._id;
        this.lootApi.claimLoot(member).subscribe(
          () => {
            this.deletingId = '';
          },
          err => {
            this.deletingId = '';
          }
        )
      }
    });
  }

  viewDetails(member: Member): void {
    this.dialog.open(DialogViewAllComponent, { data: member, width: '600px' });
  }

}
