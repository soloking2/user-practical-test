import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { MessagesService } from '../shared/messages.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(private alert: MessagesService, private router: Router) {}

  handleError(error?: Error | HttpErrorResponse): Observable<never> {
    let errorMessage: string;
    if (!navigator.onLine) {
      errorMessage =
        'No Internet Connection. Please check your internet provider';
    } else if (error instanceof HttpErrorResponse) {
      errorMessage = this.getServerErrorMessage(error);
    } else {
      errorMessage = error?.message
        ? error.message
        : error?.toString() ?? 'An error occurred';
    }


    this.alert.setMessage({
      type: 'error',
      title: 'Error Message',
      body: errorMessage
    });
    return throwError(errorMessage);
  }

  getServerErrorMessage(error: HttpErrorResponse): string {
    let message = 'No Internet Connection. Please check your internet provider';
    if (!navigator.onLine) {
      return message;
    } else {
      message = this.processErrorMessage(error);
      return message;
    }
  }

  processErrorMessage(error: HttpErrorResponse): string {
    const apiErrorResponse = error.error;
    let messages: string;
    let message;

    // if (apiErrorResponse) {
    //   for (let [key, value] of Object.entries(apiErrorResponse)) {
    //     messages = value[0];
    //   }
    // }
    message =  apiErrorResponse?.error
      ? apiErrorResponse?.error
      : messages
      ? messages
      : 'An unknown error occurred and we are unable to handle your request. Please try again';

    switch (apiErrorResponse.status) {
      case 400: {
        return message;
      }
      case 401: {
        return message;
      }
      case 500: {
        return message;
      }
      default: {
        return message;
      }
    }
  }
}
