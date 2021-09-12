import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { jobs } from 'src/app/_db';
import { Job, Member } from 'src/app/_models';
import { PageApiService } from 'src/app/_services/page-api.service';
import { TeamApiService } from 'src/app/_services/team-api.service';

@Component({
  selector: 'app-dialog-add-member',
  templateUrl: './dialog-add-member.component.html',
  styleUrls: ['./dialog-add-member.component.css']
})
export class DialogAddMemberComponent implements OnInit {

  jobs: Job[] = jobs;
  jobGroups: any[] = transformToGroup(jobs);

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(32)]),
    job: new FormControl(jobs[0], Validators.required)
  })
  submitting: boolean = false;

  constructor(
    private pageApi: PageApiService,
    private teamApi: TeamApiService,
    public dialogRef: MatDialogRef<DialogAddMemberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Member[],) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.submitting = true;

    this.teamApi.createMember({ pageId: this.pageApi.getPageId()!, name: this.form.controls.name.value, jobId: this.form.controls.job.value.id })
      .subscribe(
        newMember => {
          this.submitting = false;
          this.dialogRef.close();
        },
        err => {
          this.submitting = false;
        }
      )

  }

}

/** Transform into select group structure:
 *  [
 *    {
 *      category: "Warrior",
 *      jobs: [ { id:0 }, { id: 1 }, ...]
 *    }
 *    , ...
 *  ] 
 */
const transformToGroup = (jobs: any[]): any[] => {
  const temp: any = {};
  jobs.forEach(job => {
    if (temp[job.category]) {
      temp[job.category].push(job);
    } else {
      temp[job.category] = [job];
    }
  })
  const result: any = [];
  Object.keys(temp).forEach(key => {
    result.push({
      category: key,
      jobs: temp[key]
    })
  })
  return result;
}
