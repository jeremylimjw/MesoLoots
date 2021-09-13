import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";

export function handleError(error: HttpErrorResponse) {
    let errorMessage: string = "";

    if (error.status === 0) {
        errorMessage = "Error connecting to server. Server may be down.";
    }
    else if (error.error instanceof ErrorEvent) {		
        errorMessage = "An unknown error has occurred: " + error.error;
    } else {		
        errorMessage = error?.error?.message || `Internal server error. Please try again later.`;
    }

    console.error(errorMessage);
    return throwError(errorMessage);		
}