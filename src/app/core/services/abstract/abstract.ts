import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable, catchError, first, of, retry } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Abstract<T> {
  private _baseUrl = environment.apiUrl;
  private _http = inject(HttpClient);
  // TO CREATE A RESSOURCE
  create(endpoint: string, data: T): Observable<T> {
    return this._http
      .post<T>(`${this._baseUrl}/${endpoint}`, data)
      .pipe(catchError(this.handleError<T>()));
  }

  // TO GET A RESSOURCE
  read(endpoint: string): Observable<T> {
    return this._http
      .get<T>(`${this._baseUrl}/${endpoint}`)
      .pipe(first(), retry(3), catchError(this.handleError<T>()));
  }
  // TO UPDATE A RESSOURCE WITH PUT METHOD
  update(endpoint: string, item: T): Observable<T> {
    return this._http
      .put<T>(`${this._baseUrl}/${endpoint}`, item)
      .pipe(catchError(this.handleError<T>()));
  }
  // TO DELETE A RESSOURCE
  delete(endpoint: string): Observable<void> {
    return this._http.delete<void>(`${this._baseUrl}/${endpoint}`);
  }
  // to get one resource by id
  getById(endpoint: string, id: string): Observable<T> {
    return this._http
      .get<T>(`${this._baseUrl}/${endpoint}/${id}`)
      .pipe(first(), retry(3), catchError(this.handleError<T>()));
  }

  // Handle HTTP operation that failed.
  protected handleError<U>() {
    return (error: any): Observable<U> => {
      // Optionally log error to remote server
      console.error(error);
      // Return an observable with a user-facing error message
      return of(error as U);
    };
  }
}
