import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { bosses, items } from 'src/app/_db';
import { Boss, Item, Loot, Member, MongoId } from 'src/app/_models';
import { DistributablePipe } from 'src/app/_pipes/distributable.pipe';
import { MetricPipe } from 'src/app/_pipes/metric.pipe';
import { AuthService } from 'src/app/_services/auth.service';
import { LootApiService, PostSellBody } from 'src/app/_services/loot-api.service';
import { TeamApiService } from 'src/app/_services/team-api.service';

@Component({
  selector: 'app-dialog-loot-details',
  templateUrl: './dialog-loot-details.component.html',
  styleUrls: ['./dialog-loot-details.component.css']
})
export class DialogDetailsComponent implements OnInit {

  form: FormGroup;
  items: Item[] = items;
  bosses: Boss[] = bosses;
  team: Member[];
  isSold = this.loot.soldOn ? true : false;
  submitting: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public loot: Loot, 
    private teamApi: TeamApiService,
    private lootApi: LootApiService,
    private authService: AuthService,
    public dialog: MatDialog) {

      this.team = this.teamApi.team;

      this.form = new FormGroup({
        memberIds: new FormGroup({}),
        soldOn: new FormControl({ value: loot.soldOn, disabled: this.isSold }),
        soldPrice: new FormControl({ value: loot.soldPrice, disabled: this.isSold }),
      });

      /** Check all involved party members. */
      for (let memberId of this.loot.party) {
        this.memberIds.addControl(`${memberId._id}`, new FormControl({ value: true, disabled: true }));
      }

  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (!this.authService.isAllowedToEdit()) {
      return;
    }

    if (this.form.invalid) {
      return;
    }

    const soldPrice: number = new MetricPipe().transform(this.form.controls.soldPrice.value);

    if (soldPrice == null || soldPrice < 0) {
      return;
    }

    const body: PostSellBody = {
      lootId: this.loot._id!,
      soldOn: new Date(),
      soldPrice: soldPrice,
      distributable: new DistributablePipe().transform(soldPrice, this.getSelectedMembers().length)
    };

    this.submitting = true;
    this.lootApi.sellLoot(body).subscribe(
      newLoot => {
        this.submitting = false;
        this.dialogRef.close();
      },
      err => {
        if (err.status === 401) {
          this.dialogRef.close();
        }
        this.submitting = false;
      }
    )

  }

  get memberIds(): FormGroup {
    return this.form.controls.memberIds as FormGroup;
  }

  get teamMapping(): { [key: string]: Member } {
    return this.teamApi.teamMapping;
  }

  /** Get all selected members. */
  getSelectedMembers(): MongoId[] {
    const party = [];
    for (let key of Object.keys(this.memberIds.value)) {
      if (this.memberIds.controls[key].value === true) {
        party.push({ _id: key });
      }
    }
    return party;
  }
}
