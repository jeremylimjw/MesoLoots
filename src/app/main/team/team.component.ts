import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../_common/confirm-dialog/confirm-dialog.component';
import { Job, Member } from '../../_models';
import { jobs } from '../../_db/job';
import { TeamApiService } from '../../_services/team-api.service';
import { AddDialogComponent } from './add-dialog/add-dialog.component';
import { PageApiService } from '../../_services/page-api.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  team: Member[] = this.teamApi.team;
  deletingId: string = "";

  constructor(
    private teamApi: TeamApiService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  /** Delete member after confirmation dialog. */
  deleteMember(member: Member): void {
    const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: { title: `Remove ${member.name}`, message: "Are you sure? This action cannot be undone."}
    });

    confirmDialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        
        this.deletingId = member._id;
        this.teamApi.deleteMember(member).subscribe(
          () => {
            this.deletingId = "";
          },
          err => {
            this.deletingId = "";
          }
        )

      }
    });
  }

  /** Open add new member dialog. */
  openAddDialog(): void {
    this.dialog.open(AddDialogComponent, { width: '300px', data: this.team });
  }

  getJob(member: Member): Job {
    return jobs[member.jobId];
  }

}
