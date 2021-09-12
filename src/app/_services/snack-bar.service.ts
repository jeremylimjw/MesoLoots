import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private _snackBar: MatSnackBar) { }

  open(message: string): void {
    this._snackBar.open(message, "Dismiss", { duration: 5000 });
  }

  openForever(message: string): void {
    this._snackBar.open(message, "Dismiss");
  }
}
