import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PeliculasService } from '../../services/peliculas.service';
import { MovieRespons } from '../../interfaces/movie-response';
import { Location } from '@angular/common';
import { Cast } from '../../interfaces/credits-response';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-pelicula',
  templateUrl: './pelicula.component.html',
  styleUrls: ['./pelicula.component.css']
})
export class PeliculaComponent implements OnInit {
  public pelicula: MovieRespons;
  public cast: Cast[] = [];

  constructor( private activatedRoute: ActivatedRoute, private peliculasService: PeliculasService, private location: Location, private router: Router ) { }

  ngOnInit(): void {
    // Usando desestructuring
    const { id } = this.activatedRoute.snapshot.params;

    combineLatest([
      this.peliculasService.getPeliculaDetalles( id ),
      this.peliculasService.getCast( id )
    ]).subscribe( ( [pelicula, cast] ) => {

      if ( !pelicula ) {
            this.router.navigateByUrl('/home');
            return;
          }
      this.pelicula = pelicula;

      this.cast = cast.filter( actor => actor.profile_path !== null );

    });
    
  }

  // Regresamos a la vista anterior
  onRegresar() {
    this.location.back();
  }

}
