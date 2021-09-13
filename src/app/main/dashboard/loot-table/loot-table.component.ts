import { Component, OnInit, AfterViewInit, ViewChild, Input, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Boss, Item, Loot, Member } from 'src/app/_models';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogDetailsComponent } from './dialog-loot-details/dialog-loot-details.component';
import { DialogAddComponent } from './dialog-loot-add/dialog-loot-add.component';
import { ConfirmDialogComponent } from 'src/app/_common/dialog-confirm/dialog-confirm.component';
import { LootApiService } from 'src/app/_services/loot-api.service';
import { bosses, items } from 'src/app/_db';
import { PageApiService } from 'src/app/_services/page-api.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-loot-table',
  templateUrl: './loot-table.component.html',
  styleUrls: ['./loot-table.component.css']
})
export class LootTableComponent implements OnInit, AfterViewInit {

  items: Item[] = items;
  bosses: Boss[] = bosses;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('bottom') scrollToBottomRef!: ElementRef;
  dataSource = this.lootApi.lootTableDataSource;
  displayedColumns: string[] = ['delete', 'droppedOn', 'item', 'boss', 'soldPrice', 'distributable', 'soldOn'];

  filters = this.formBuilder.group({ item: '', bossId: '', status: '' });

  deletingLootId: string = '';

  _autoCompleteItems = new BehaviorSubject<any[]>([]);

  constructor(
    private lootApi: LootApiService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    /** Initialize table filter. */
    this.filters.valueChanges
      .pipe(debounceTime(300))
      .subscribe(val => {
      this.dataSource.filter = JSON.stringify(val);
      this.dataSource.paginator?.firstPage();
    });

    /** Initialise autocomplete options */
    this._autoCompleteItems.next(this.items)

    /** Cascade items based on selected bosses */
    this.filters.controls.bossId.valueChanges.subscribe((bossId: any) => {
      if (bossId === "") {
        this._autoCompleteItems.next(this.items)
      } else {
        this._autoCompleteItems.next(this.items.filter(item => item.droppedByIds.indexOf(+bossId) > -1))
      }
      this.filters.controls.item.setValue("");
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor();
    this.dataSource.filterPredicate = this.customFilterPredicate();

    /** Set timeout as a workaround for the table loading entire dataset before pagination is mounted. */
    setTimeout(() => {
      this.dataSource.data = this.lootApi.loots;
    });

  }

  sortingDataAccessor() {
    const mySortingDataAccessor = (item: any, property: string) => {
      switch (property) {
        case 'boss': return bosses[item.bossId].name;
        case 'item': return items[item.itemId].name;
        default: return item[property];
      }
    }
    return mySortingDataAccessor;
  }
  
  customFilterPredicate() {
    const myFilterPredicate = (data: Loot, filters: any): boolean => {

      filters = JSON.parse(filters);

      let itemInputString = typeof filters.item === 'string' ? filters.item : filters.item.name;
      itemInputString = itemInputString.toLowerCase().replace(/\s/g, '');
      
      /** filters.bossId may be an empty string '' OR the bossId number. */
      if (filters.status === 'NOT_SOLD') {
        return data.bossId.toString().trim().indexOf(filters.bossId.toString()) !== -1 &&
        items[data.itemId].keyword.indexOf(itemInputString) !== -1 && 
          data.soldOn == null;
      } else if (filters.status === 'SOLD') {
        return data.bossId.toString().trim().indexOf(filters.bossId.toString()) !== -1 &&
        items[data.itemId].keyword.indexOf(itemInputString) !== -1 && 
          data.soldOn != null;
      } else {
        return data.bossId.toString().trim().indexOf(filters.bossId.toString()) !== -1 &&
        items[data.itemId].keyword.indexOf(itemInputString) !== -1;
      }
    }

    return myFilterPredicate;
  }

  resetFilter(): void {
    this.filters.setValue({ item: '', bossId: '', status: '' });
  }

  deleteItem(e: any, loot: Loot): void {
    e.stopPropagation();
    
    const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: { title: `Remove ${items[loot.itemId].name}`, message: "Are you sure? This action cannot be undone."}
    });

    confirmDialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deletingLootId = loot._id!;
        this.lootApi.deleteLoot(loot).subscribe(
          () => {
            this.deletingLootId = '';
          },
          err => {
            this.deletingLootId = '';
          }
        )
      }
    });
  }

  openDetailsDialog(loot: Loot): void {
    this.dialog.open(DialogDetailsComponent, { width: '600px', data: loot });
  }

  openAddDialog(): void {
    this.dialog.open(DialogAddComponent, { 
      width: '600px',
      autoFocus: false 
    });
  }

  autoCompleteGetFilterKeyword(item: any): string {
    return item.keyword;
  }

  autoCompleteOptionSelected(item: any): void {
    this.filters.controls.item.setValue(item.name);
  }

  autoCompleteGetImgSrc(item: any): string {
    return item.iconUrl;
  }

  scrollToBottom(): void {
    setTimeout(() => {
      this.scrollToBottomRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }, 10)
  }

}
