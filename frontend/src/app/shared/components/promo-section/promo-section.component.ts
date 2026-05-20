import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-promo-section',
    standalone: true,
    imports: [CommonModule, RouterLink],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './promo-section.component.html',
    styleUrls: ['./promo-section.component.scss']
})
export class PromoSectionComponent { }
