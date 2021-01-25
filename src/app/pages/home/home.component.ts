import { Component, HostListener, OnInit } from '@angular/core';
import { PeliculasService } from '../../services/peliculas.service';
import { Movie } from '../../interfaces/cartelera-response';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public movies: Movie[] = [];
  public moviesSlideshow: Movie[] = [];

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const pos = (document.documentElement.scrollTop || document.body.scrollTop) + 1200;
    const max = (document.documentElement.scrollHeight || document.body.scrollHeight);

    if (pos > max) {
      // Llamar al servicio
      if (this.peliculasService.cargando) {return;}
      this.peliculasService.getCartelera().subscribe( movies => {
        this.moviesSlideshow.push(...movies);
      });
    }
  }

  constructor(private peliculasService: PeliculasService) { }

  ngOnInit(): void {
    this.peliculasService.getCartelera()
      .subscribe(movies => {
        // console.log(resp);
        this.movies = movies;
        this.moviesSlideshow = movies;
      })
  }

}