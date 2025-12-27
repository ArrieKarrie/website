// src/utils/lenis.ts
import Lenis from 'lenis';

interface LenisConfig {
    wrapper: HTMLElement;
    content: HTMLElement;
}

export function initLenis({ wrapper, content }: LenisConfig) {
    // Shared Configuration
    const lenis = new Lenis({
        wrapper: wrapper,
        content: content,
        duration: 1.5,  // Smoother/Longer inertia
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.75, // Smaller steps
    });

    // Shared RAF Loop
    function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return lenis;
}