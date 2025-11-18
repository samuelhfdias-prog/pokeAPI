import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable, switchMap, from, mergeMap, toArray, catchError, of } from 'rxjs';
import {
  ApiPokemonDetail,
  ApiPokemonListResponse,
  Pokemon,
  TYPE_COLORS,
} from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) {}

  private transformToPokemon(detail: ApiPokemonDetail): Pokemon {
    const types = detail.types.map((t) => t.type.name);
    return {
      id: detail.id,
      name: detail.name.charAt(0).toUpperCase() + detail.name.slice(1),
      imageUrl: detail.sprites.other?.['official-artwork'].front_default || detail.sprites.front_default || '',
      types: types,
      color: TYPE_COLORS[types[0]] || '#777',
      secondaryColor: types[1] ? TYPE_COLORS[types[1]] : undefined,
      height: detail.height / 10,
      weight: detail.weight / 10,
    };
  }

  getPokemonDetail(identifier: string | number): Observable<Pokemon> {
    return this.http
      .get<ApiPokemonDetail>(`${this.apiUrl}/${identifier.toString().toLowerCase()}`)
      .pipe(map((detail) => this.transformToPokemon(detail)));
  }

  getPokemonList(limit: number, offset: number = 0): Observable<Pokemon[]> {
    return this.http
      .get<ApiPokemonListResponse>(`${this.apiUrl}?limit=${limit}&offset=${offset}`)
      .pipe(
        switchMap((response) => {
          return from(response.results).pipe(
            mergeMap((item) => 
              this.getPokemonDetail(item.name).pipe(
                catchError((error) => {
                  console.warn(`Erro ao carregar ${item.name}`, error);
                  return of(null); 
                })
              ),10),
            toArray(),
            map((pokemons) => pokemons.filter((p): p is Pokemon => p !== null))
          );
        })
      );
  }

  getTrainersTeam(pokemonNames: string[]): Observable<Pokemon[]> {
    const requests = pokemonNames.map(name => this.getPokemonDetail(name));
    return forkJoin(requests);
  }
}