import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { URL_SERVICES } from 'src/environments/environment';
import { Producto } from '../models/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  url = `${URL_SERVICES}Producto`;

  constructor(
    private http: HttpClient
  ) { }

  get() {
    return this.http
      .get(`${this.url}`)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  getById(id: number) {
    return this.http
      .get(`${this.url}byId/${id}`)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }


  insert(producto: Producto) {
    return this.http.post(`${this.url}`, producto).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  update(id: number, producto: Producto) {
    return this.http.put(`${this.url}/${id}`, producto).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }
}
