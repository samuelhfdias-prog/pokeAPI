export interface ApiPokemonType {
  slot: number;
  type: { name: string; url: string };
}

export interface ApiPokemonSprites {
  front_default: string | null;
  other?: {
    'official-artwork': {
      front_default: string | null;
    };
  };
}

export interface ApiPokemonDetail {
  id: number;
  name: string;
  types: ApiPokemonType[];
  sprites: ApiPokemonSprites;
  height: number;
  weight: number;
}

export interface ApiPokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: { name: string; url: string }[];
}

export const TYPE_COLORS: { [key: string]: string } = {
  normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C',
  grass: '#7AC74C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1',
  ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
  rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', steel: '#B7B7CE',
  fairy: '#D685AD', dark: '#705746',
};

export interface Pokemon {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
  color: string;
  secondaryColor?: string;
  height: number;
  weight: number;
}

export interface Generation {
  id: number;
  name: string;
  limit: number;
  offset: number;
}

export const GENERATIONS: Generation[] = [
  { id: 0, name: 'Todas as Gerações', limit: 1025, offset: 0 },
  { id: 1, name: '1ª Geração (Kanto)', limit: 151, offset: 0 },
  { id: 2, name: '2ª Geração (Johto)', limit: 100, offset: 151 },
  { id: 3, name: '3ª Geração (Hoenn)', limit: 135, offset: 251 },
  { id: 4, name: '4ª Geração (Sinnoh)', limit: 107, offset: 386 },
  { id: 5, name: '5ª Geração (Unova)', limit: 156, offset: 493 },
  { id: 6, name: '6ª Geração (Kalos)', limit: 72, offset: 649 },
  { id: 7, name: '7ª Geração (Alola)', limit: 88, offset: 721 },
  { id: 8, name: '8ª Geração (Galar)', limit: 96, offset: 809 },
  { id: 9, name: '9ª Geração (Paldea)', limit: 120, offset: 905 },
];

export interface Trainer {
  name: string;
  imageUrl: string;
  pokemons: string[]; 
}