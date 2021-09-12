import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  constructor(
    private teamApi: TeamApiService,
    private lootApi: LootApiService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    ) { }

  ngOnInit(): void {
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
    this._snackBar.open("This feature is still a work in progress.", "Dismiss", { duration: 5000 });
    // const distributable = this.lootService.getDistributableOf(member);
    // if (!distributable || distributable?.loots.length === 0) {
    //   this._snackBar.open("Nothing to claim.", "Close", { duration: 5000 });
    //   return;
    // }
    
    // const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    //   maxWidth: "400px",
    //   data: { 
    //     title: `Confirm claim for ${member.name}`, 
    //     message: `Has ${member.name} received ${new DecimalPipe('en-SG').transform(this.getTotalDistributableOf(member), '1.0')} mesos?`
    //   }
    // });

    // dialogRef.afterClosed().subscribe(dialogResult => {
    //   if (dialogResult) {
    //     this.lootService.claimDistributable(member);
    //     this._snackBar.open("Claim successfully updated.", "Close", { duration: 5000 });
    //   }
    // });
  }

  viewDetails(member: Member): void {
    this.dialog.open(DialogViewAllComponent, { data: member, width: '600px' });
  }

}
