import Lenis from 'lenis';

interface LenisConfig {
    wrapper: HTMLElement;
    content: HTMLElement;
}

export function initLenis({ wrapper, content }: LenisConfig) {
    // 1. Detect Mobile (matching your CSS aspect-ratio logic)
    // If it's a mobile screen (portrait), we typically want native scroll.
    const isMobile = window.matchMedia('(max-aspect-ratio: 3.1/4)').matches;

    // 2. Abort if mobile
    if (isMobile) {
        return null;
    }

    // 3. Desktop Setup
    const lenis = new Lenis({
        wrapper: wrapper,
        content: content,
        duration: 1.8,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.6,
    });

    function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return lenis;
}