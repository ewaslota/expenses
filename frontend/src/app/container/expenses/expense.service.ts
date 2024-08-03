import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ExpenseEntity } from './expense-entity.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface ExpenseResponse {
  totalPages: number;
  totalElements: number;
  size: number;
  content: ExpenseEntity[];
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  first: boolean;
  last: boolean;
  empty: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private apiUrl = `${environment.apiUrl}/api/expenses`;

  constructor(private httpClient: HttpClient) {
    console.log(`API URL: ${this.apiUrl}`); // Log the API URL to the console
  }

  getExpenses(
    page: number,
    size: number,
    sortColumns: string,
    sortDirections: string,
    searchBy: string
  ): Observable<ExpenseResponse> {
    return this.httpClient
      .get<ExpenseResponse>(
        `${this.apiUrl}?page=${page}&size=${size}&sortColumns=${sortColumns}&sortDirections=${sortDirections}&searchBy=${searchBy}`
      )
      .pipe(catchError(this.handleError));
  }

  addExpense(expense: ExpenseEntity): Observable<ExpenseEntity> {
    return this.httpClient
      .post<ExpenseEntity>(this.apiUrl, expense)
      .pipe(catchError(this.handleError));
  }

  updateExpense(expense: ExpenseEntity): Observable<ExpenseEntity> {
    return this.httpClient
      .put<ExpenseEntity>(`${this.apiUrl}/${expense.id}`, expense)
      .pipe(catchError(this.handleError));
  }

  getExpense(id: number): Observable<ExpenseEntity> {
    return this.httpClient
      .get<ExpenseEntity>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  deleteExpense(expenseId: number): Observable<void> {
    return this.httpClient
      .delete<void>(`${this.apiUrl}/${expenseId}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage: string[] = ['An unknown error occurred!'];
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred.
      errorMessage = [`Error: ${error.error.message}`];
    } else if (error.error && typeof error.error === 'object') {
      // Handle validation errors
      const validationErrors = error.error;
      errorMessage = Object.entries(validationErrors).map(
        ([field, msg]) => `${msg}`
      );
    } else {
      errorMessage = [
        `Server returned code: ${error.status}, error message is: ${error.message}`,
      ];
    }
    return throwError(errorMessage);
  }
}
