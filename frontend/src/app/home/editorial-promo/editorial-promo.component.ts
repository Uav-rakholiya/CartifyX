import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ScrollAnimationDirective } from '../../shared/directives/scroll-animation.directive';

@Component({
    selector: 'app-editorial-promo',
    standalone: true,
    imports: [CommonModule, RouterLink, ScrollAnimationDirective],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './editorial-promo.component.html',
    styleUrls: ['./editorial-promo.component.scss']
})
export class EditorialPromoComponent { }
