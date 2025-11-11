import { TestBed } from '@angular/core/testing';
import { PokemonCard } from './pokemon-card';

describe('PokemonCard', () => {
  let service: PokemonCard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokemonCard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
