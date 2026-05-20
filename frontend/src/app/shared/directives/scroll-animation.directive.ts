import { Directive, ElementRef, OnInit, OnDestroy, Renderer2, Input, NgZone } from '@angular/core';

@Directive({
    selector: '[appScrollAnimation]',
    standalone: true
})
export class ScrollAnimationDirective implements OnInit, OnDestroy {
    @Input() animation: string = 'fade-in-up';
    @Input() delay: number = 0;

    private observer: IntersectionObserver | undefined;

    constructor(private el: ElementRef, private renderer: Renderer2, private ngZone: NgZone) { }

    ngOnInit() {
        // Only hide if not already animated.
        // We use a shorter timeout to minimize the "blank" duration.
        if (!this.el.nativeElement.classList.contains(`animate-${this.animation}`)) {
            this.renderer.addClass(this.el.nativeElement, 'opacity-0');
        }

        // Run outside Angular to prevent triggering Change Detection continuously during scroll
        this.ngZone.runOutsideAngular(() => {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Use requestAnimationFrame directly, avoid setTimeout if delay is 0
                        if (this.delay > 0) {
                            setTimeout(() => this.animate(), this.delay);
                        } else {
                            this.animate();
                        }
                        this.observer?.unobserve(this.el.nativeElement);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '50px' // Trigger slightly before element comes into view
            });

            this.observer.observe(this.el.nativeElement);
        });
    }

    private animate() {
        requestAnimationFrame(() => {
            this.renderer.removeClass(this.el.nativeElement, 'opacity-0');
            this.renderer.addClass(this.el.nativeElement, `animate-${this.animation}`);
        });
    }

    ngOnDestroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}
