import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { bosses, items } from 'src/app/_db';
import { Boss, Item, Loot, Member, MongoId } from 'src/app/_models';
import { DistributablePipe } from 'src/app/_pipes/distributable.pipe';
import { MetricPipe } from 'src/app/_pipes/metric.pipe';
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
    public dialog: MatDialog) {

      this.team = this.teamApi.team;

      this.form = new FormGroup({
        memberIds: new FormGroup({}),
        soldOn: new FormControl({ value: loot.soldOn, disabled: this.isSold }),
        soldPrice: new FormControl({ value: loot.soldPrice, disabled: this.isSold }),
      });

      /** Check all involved party members. */
      for (let member of this.team) {
        this.memberIds.addControl(member._id, new FormControl({ value: loot.party.some(x => x._id === member._id), disabled: true }));
      }

  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const soldPrice: number = new MetricPipe().transform(this.form.controls.soldPrice.value);

    if (!soldPrice || soldPrice <= 0) {
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
      err => this.submitting = false
    )

  }

  get memberIds(): FormGroup {
    return this.form.controls.memberIds as FormGroup;
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
