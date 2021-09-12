import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.css']
})
export class AutoCompleteComponent implements OnInit {

  searchResults!: Observable<any[]>;

  /** REQUIRED */
  @Input() _searchStore!: BehaviorSubject<any[]>; // The items to filter through.
  @Input() getFilterKeyword!: (x: any) => string; // The filter keyword to compare.
  @Input() optionKey!: string;                    // What will be displayed in the individual options in the select box.

  /** OPTIONAL */
  @Input() getImgSrc: (x: any) => string = (x) => '';            // Optional image icon on the left.
  @Input() appearance: MatFormFieldAppearance = 'fill';
  @Input() subtitleKey: string = '';              // Same as optionKey, this will be a smaller font size, seperated by a '|'.
  @Input() textInput: any = new FormControl("");  // The form control of the search text input.
  @Input() resetAfterClick: boolean = true;       // Clear the form control after option selected?
  @Input() label: string = '';                    // Form field label.
  @Input() placeholder: string = '';              // HTML placeholder
  @Input() style: any = {};                       // Optional styles in the <mat-form-field> tag

  @Output() optionSelected = new EventEmitter<any>(); 

  constructor() { }

  ngOnInit(): void {
    /** Filter results when text input changes. */
    this.searchResults = this.textInput.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(inputValue => {
        /** inputValue will either be a plaintext when typing, or an object when user clicks on the option. */
        if (typeof inputValue === 'string' || inputValue instanceof String) {
          return this._searchStore.value.filter(x => this.getFilterKeyword(x).toLowerCase().replace(/\s/g, '').includes(inputValue.toLowerCase().replace(/\s/g, '')))
        } 
        /** If user clicks on option, return all items. */
        else {
          return this._searchStore.value;
        }
      })
    );

    /** When search store changes, trigger re-render of autocomplete options. */
    this._searchStore.subscribe(() => {
      this.textInput.setValue('');
    })

  }

  /** Emit clicked item and reset text input value. */
  handleOptionSelected(item: any): void {
    this.optionSelected.emit(item);

    if (this.resetAfterClick) {
      this.textInput.setValue('');
    } else {
      this.textInput.setValue(item[this.optionKey]);
    }
  }

}
