import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CategoryEntity } from './category-entity.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface CategoryResponse {
  totalPages: number;
  totalElements: number;
  size: number;
  content: CategoryEntity[];
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
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/api/categories`;

  constructor(private httpClient: HttpClient) {
    console.log(`API URL: ${this.apiUrl}`); // Log the API URL to the console
  }

  getCategories(
    page: number,
    size: number,
    sortColumns: string,
    sortDirections: string,
    searchBy: string
  ): Observable<CategoryResponse> {
    return this.httpClient
      .get<CategoryResponse>(
        `${this.apiUrl}?page=${page}&size=${size}&sortColumns=${sortColumns}&sortDirections=${sortDirections}&searchBy=${searchBy}`
      )
      .pipe(catchError(this.handleError));
  }

  addCategory(category: CategoryEntity): Observable<CategoryEntity> {
    return this.httpClient
      .post<CategoryEntity>(this.apiUrl, category)
      .pipe(catchError(this.handleError));
  }

  updateCategory(category: CategoryEntity): Observable<CategoryEntity> {
    return this.httpClient
      .put<CategoryEntity>(`${this.apiUrl}/${category.id}`, category)
      .pipe(catchError(this.handleError));
  }

  getCategory(id: number): Observable<CategoryEntity> {
    return this.httpClient
      .get<CategoryEntity>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  deleteCategory(categoryId: number): Observable<void> {
    return this.httpClient
      .delete<void>(`${this.apiUrl}/${categoryId}`)
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
