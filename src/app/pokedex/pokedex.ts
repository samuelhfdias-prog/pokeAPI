import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokemonService } from '../service/service';
import {
  Pokemon,
  TYPE_COLORS,
  GENERATIONS,
  Generation,
  Trainer,
} from '../models/models';
import { PokemonCardComponent } from './pokemon-card/pokemon-card';

@Component({
  selector: 'app-pokedex',
  standalone: true,
  imports: [CommonModule, FormsModule, TitleCasePipe, PokemonCardComponent],
  templateUrl: './pokedex.html',
  styleUrl: './pokedex.css',
})
export class Pokedex implements OnInit {
  isLoading: boolean = false;
  displayedPokemons: Pokemon[] = [];
  fullListInMemory: Pokemon[] = [];
  searchTerm: string = '';
  generations = GENERATIONS;
  selectedGen: Generation = this.generations[0];
  generationSearchTerm: string = '';
  filteredGenerations: Generation[] = [...this.generations];
  allTypes = ['todos', ...Object.keys(TYPE_COLORS)];
  selectedType: string = 'todos';
  allWeights = ['todos', 'leve (<10kg)', 'médio (10-100kg)', 'pesado (>100kg)'];
  allHeights = ['todos', 'baixo (<1 metro)', 'médio (1-2 metros)', 'alto (>2 metros)'];
  selectedWeight: string = 'todos';
  selectedHeight: string = 'todos';
  selectedTrainer: Trainer | null = null;
  trainers: Trainer[] = [
    {
      name: 'Ash',
      imageUrl: 'Imagens-treinadores/Imagem_Ash.jpeg',
      pokemons: ['pikachu', 'charizard', 'squirtle', 'bulbasaur', 'pidgeot', 'snorlax', 'mewtwo'],
    },
    {
      name: 'Misty',
      imageUrl: 'Imagens-treinadores/Imagem_Misty.jpeg',
      pokemons: ['starmie', 'psyduck', 'togepi', 'horsea', 'gyarados'],
    },
    {
      name: 'Gary',
      imageUrl: 'Imagens-treinadores/Imagem_Gary.jpeg',
      pokemons: ['blastoise', 'arcanine', 'nidoking', 'umbreon', 'electivire'],
    },
    {
      name: 'Cynthia',
      imageUrl: 'Imagens-treinadores/Imagem_Cynthia.jpeg',
      pokemons: ['garchomp', 'lucario', 'roserade', 'togekiss', 'spiritomb', 'milotic'],
    },
  ];

  constructor(private pokemonService: PokemonService) {}
  ngOnInit(): void {
    this.loadGeneration(this.selectedGen);
    this.filteredGenerations = this.generations;
  }
  filterGenerations(): void {
    if (!this.generationSearchTerm) {
      this.filteredGenerations = this.generations;
    } else {
      const term = this.generationSearchTerm.toLowerCase();
      this.filteredGenerations = this.generations.filter((gen) =>
        gen.name.toLowerCase().includes(term)
      );
    }
      if (
      this.filteredGenerations.length > 0 &&
      !this.filteredGenerations.includes(this.selectedGen)
    ) 
    {
      this.selectedGen = this.filteredGenerations[0];
      this.onGenChange();
    }
  }
  loadGeneration(gen: Generation): void {
    if (!gen) return;

    this.isLoading = true;
    this.selectedTrainer = null;
    this.selectedGen = gen;

    this.pokemonService.getPokemonList(gen.limit, gen.offset).subscribe({
      next: (pokemons) => {
        this.fullListInMemory = pokemons;
        this.applyFilters(); 
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar geração:', err);
        this.isLoading = false;
      },
    });
  }
  loadTrainerTeam(trainer: Trainer): void {
    this.isLoading = true;
    this.selectedTrainer = trainer;
    this.selectedType = 'todos'; // Reseta filtro de tipo para mostrar todo o time

    this.pokemonService.getTrainersTeam(trainer.pokemons).subscribe({
      next: (pokemons) => {
        this.fullListInMemory = pokemons;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar time do treinador:', err);
        this.isLoading = false;
      },
    });
  }
  onGenChange(): void {
    this.loadGeneration(this.selectedGen);
  }
  applyFilters(): void {
    let filteredList = this.fullListInMemory;

    filteredList = this.filterByName(filteredList);
    filteredList = this.filterByType(filteredList);
    filteredList = this.filterByHeight(filteredList);
    filteredList = this.filterByWeight(filteredList);

    this.displayedPokemons = filteredList;
  }

  private filterByName(pokemons: Pokemon[]): Pokemon[] {
    if (!this.searchTerm) return pokemons;
    const term = this.searchTerm.toLowerCase();
    return pokemons.filter((p) => p.name.toLowerCase().includes(term));
  }

  private filterByType(pokemons: Pokemon[]): Pokemon[] {
    if (this.selectedType === 'todos') return pokemons;
    const type = this.selectedType.toLowerCase();
    return pokemons.filter((p) => p.types.includes(type));
  }

  private filterByHeight(pokemons: Pokemon[]): Pokemon[] {
    if (this.selectedHeight === 'todos') return pokemons;
    
    return pokemons.filter((p) => {
      const height = p.height;
      switch (this.selectedHeight) {
        case 'baixo (<1 metro)':
          return height < 1;
        case 'médio (1-2 metros)':
          return height >= 1 && height <= 2;
        case 'alto (>2 metros)':
          return height > 2;
        default:
          return true;
      }
    });
  }

  private filterByWeight(pokemons: Pokemon[]): Pokemon[] {
    if (this.selectedWeight === 'todos') return pokemons;
    return pokemons.filter((p) => {
      const weight = p.weight;
      switch (this.selectedWeight) {
        case 'leve (<10kg)':
          return weight < 10;
        case 'médio (10-100kg)':
          return weight >= 10 && weight <= 100;
        case 'pesado (>100kg)':
          return weight > 100;
        default:
          return true;
      }
    });
  }
}