import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CarteleraResponse, Movie } from '../interfaces/cartelera-response';
import { catchError, map, tap } from 'rxjs/operators';
import { MovieRespons } from '../interfaces/movie-response';
import { Cast, CreditsRespnse } from '../interfaces/credits-response';

@Injectable({
  providedIn: 'root'
})
export class PeliculasService {
  private baseURL: string = 'https://api.themoviedb.org/3';
  private carteleraPage = 1;
  public cargando: boolean = false;

  constructor( private http: HttpClient ) { }

  get params() {
    return {
      api_key: 'd64016245a078ca218d1cadeb2fadba1',
      language: 'es-ES',
      page: this.carteleraPage.toString()
    }
  }

  resetCarteleraPage() {
    this.carteleraPage = 1;
  }

  getCartelera(): Observable<Movie[]> {
    if (this.cargando) {
      // cargando pelicula
      return of([]);
    }

    this.cargando = true;
    return this.http.get<CarteleraResponse>(`${this.baseURL}/movie/now_playing`, {
      params: this.params
    }).pipe(
      map( (resp) => resp.results ),
      tap( () => {
        this.carteleraPage += 1;
        this.cargando = false;
      })
    );
  }

  buscarPeliculas( texto: string ):Observable<Movie[]> {
    const params = {...this.params, page: '1', query: texto};

    return this.http.get<CarteleraResponse>(`${ this.baseURL }/search/movie`,{
      params
    }).pipe(
      map( resp => resp.results )
    )
  }

  getPeliculaDetalles( id: string ) {
    return this.http.get<MovieRespons>(`${ this.baseURL }/movie/${ id }`, {
      params: this.params
    }).pipe(
      catchError( err => of(null) )
    );
  }

  getCast( id: string ):Observable<Cast[]> {
    return this.http.get<CreditsRespnse>(`${ this.baseURL }/movie/${ id }/credits`, {
      params: this.params
    }).pipe (
      map( resp => resp.cast ),
      catchError( err => of([]) )
    );
  }
}
