import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/_common/dialog-confirm/dialog-confirm.component';
import { Member } from 'src/app/_models';
import { AuthService } from 'src/app/_services/auth.service';
import { LootApiService } from 'src/app/_services/loot-api.service';
import { TeamApiService } from 'src/app/_services/team-api.service';
import { DialogViewAllComponent } from './dialog-distributable-details/dialog-distributable-details.component';

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
    private authService: AuthService,
    public dialog: MatDialog,
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
      const distributable = lootMapping[lootMongoId._id].distributable;
      sum += distributable ? +distributable : 0;
    }
    return sum;
  }

  confirmClaim(member: Member): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: { 
        title: `Confirm claim for ${member.name}`, 
        message: `${member.name} received ${new DecimalPipe('en-SG').transform(this.getTotalDistributableOf(member), '1.0')} mesos?`
      }
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.claim(member);
      }
    });
  }

  viewDetails(member: Member): void {
    const dialogRef = this.dialog.open(DialogViewAllComponent, { data: member, width: '600px' });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.claim(member);
      }
    });
  }

  private claim(member: Member): void {
    if (!this.authService.isAllowedToEdit()) {
      return;
    }

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

}
