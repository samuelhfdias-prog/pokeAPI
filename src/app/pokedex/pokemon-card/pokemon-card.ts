import { Component, Input } from '@angular/core';
import { NgFor, DecimalPipe, UpperCasePipe } from '@angular/common';
import { Pokemon, TYPE_COLORS } from '../../models/models';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [NgFor, DecimalPipe, UpperCasePipe],
  template: `
<div
      class="pokemon-card"
      [style.background]="getCardBackground()"
      [style.borderColor]="pokemon.color"
    >
      <div class="card-header">
        <span class="pokemon-id">#{{ pokemon.id | number: '3.0' }}</span>
        <h2 class="pokemon-name">{{ pokemon.name }}</h2>
      </div>

      <img
        [src]="pokemon.imageUrl"
        [alt]="pokemon.name"
        class="pokemon-image"
      />

      <div class="type-container">
        <span
          *ngFor="let type of pokemon.types"
          class="pokemon-type"
          [style.backgroundColor]="getTypeColor(type)"
        >
          {{ type | uppercase }}
        </span>
      </div>

      <div class="stats-container">
        <div class="stat-item">
          <span class="stat-label">ALTURA</span>
          <span class="stat-value">{{ pokemon.height | number: '1.1-2' }} m</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">PESO</span>
          <span class="stat-value">{{ pokemon.weight | number: '1.1-2' }} kg</span>
        </div>
      </div>
    </div>
  `,
styleUrls: ['./pokemon-card.css'],
})
export class PokemonCardComponent {
  @Input() pokemon!: Pokemon;
  typeColors = TYPE_COLORS;
  getCardBackground(): string {
    const primary = this.pokemon.color;
    const secondary = this.pokemon.secondaryColor;

    if (secondary) {
    return `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`;
    }
    const rgb = this.hexToRgb(primary);
    return `rgba(${rgb}, 0.8)`;
  }

  getTypeColor(type: string): string {
    return this.typeColors[type.toLowerCase()] || '#777';
  }

  private hexToRgb(hex: string): string {
    if (!hex || hex.length !== 7 || hex[0] !== '#') {
    return '119, 119, 119';
    }
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  }
}