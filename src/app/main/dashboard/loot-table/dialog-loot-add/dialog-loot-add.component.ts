import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { items, bosses } from '../../../../_db';
import { Boss, Item, Loot, Member, MongoId } from 'src/app/_models';
import { LootApiService } from 'src/app/_services/loot-api.service';
import { TeamApiService } from 'src/app/_services/team-api.service';

@Component({
  selector: 'app-dialog-loot-add',
  templateUrl: './dialog-loot-add.component.html',
  styleUrls: ['./dialog-loot-add.component.css']
})
export class DialogAddComponent implements OnInit {

  items: Item[] = items;
  bosses: Boss[] = bosses;
  team: Member[] = this.teamApi.team;

  form: FormGroup = new FormGroup({
    droppedOn: new FormControl(new Date(), Validators.required),
    bossId: new FormControl(0, Validators.required),
    memberIds: new FormGroup({}),
    loots: new FormArray([], Validators.required)
  })
  submitting: boolean = false;

  _autoCompleteItems = new BehaviorSubject<Item[]>([]);

  constructor(
    private teamApi: TeamApiService,
    private lootApi: LootApiService,
    public dialogRef: MatDialogRef<DialogAddComponent>) {
  }

  ngOnInit(): void {
    /** Initialise autocomplete options */
    this._autoCompleteItems.next(this.items.filter(item => item.droppedByIds.indexOf(this.form.controls.bossId.value) > -1));

    /** Update autocomplete options to cascade items based on selected bosses */
    this.form.controls.bossId.valueChanges.subscribe((bossId: number) => {
      this._autoCompleteItems.next(this.items.filter(item => item.droppedByIds.indexOf(bossId) > -1));
    })

    /** By default all members are selected. */
    for (let member of this.team) {
      this.memberIds.addControl(member._id, new FormControl(true))
    }
  }

  /** Triggered when autocomplete option is selected. */
  addLoot(item: Item): void {
    /** Add loot to form. */
    const loots = this.form.controls.loots as FormArray;
    const loot: Loot = {
      party: this.getSelectedMembers(),
      itemId: item.id,
      bossId: this.form.controls.bossId.value,
      droppedOn: this.form.controls.droppedOn.value
    }
    loots.push(new FormControl(loot))
  }

  /** Remove an item. */
  removeLoot(index: number): void {
    const loots = this.form.controls.loots as FormArray;
    loots.removeAt(index);
  }

  /** Form submit. */
  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    
    this.submitting = true;
    this.lootApi.createLoots(this.form.controls.loots.value).subscribe(
      newLoots => {
        this.submitting = false;
        this.dialogRef.close();
      },
      err => {
        this.submitting = false;
      }
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

  autoCompleteGetFilterKeyword(item: any): string {
    return item.keyword;
  }

  autoCompleteGetImgSrc(item: any): string {
    return item.iconUrl;
  }

}
