import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-announcement-bar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './announcement-bar.component.html',
    styleUrls: ['./announcement-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnnouncementBarComponent {
    announcements = [
        "Get 10% Off On Selected Items",
        "•",
        "Limited Time Offer",
        "•",
        "Free Shipping And Returns",
        "•",
        "Fashion Sale You Can't Resist",
        "•"
    ];
}
