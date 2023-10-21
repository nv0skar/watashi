// whoami
// Copyright (C) 2023 Oscar

import Typed from "typed.js";
import Rellax from "rellax";
import { PowerGlitch } from "powerglitch";

export function fade<T extends Element>(elements: T[], animation: string) {
    const onScreen = new IntersectionObserver((elements) => {
        elements.forEach((element) => {
            if (element.isIntersecting) {
                element.target.classList.remove(animation);
            }
        })
    }, {
        threshold: 0.1
    })
    elements.forEach((element) => {
        element.classList.add(animation);
        onScreen.observe(element)
    })
}

export function writing<T extends Element>(element: T, phrases: string[]) {
    let effect = new Typed(element, {
        strings: phrases,
        typeSpeed: 50,
        fadeOut: true
    });
    new IntersectionObserver((elements) => {
        elements.forEach((element) => {
            if (element.isIntersecting) {
                effect.start()
            } else {
                effect.stop()
            }
        })
    }, {
        threshold: 1.0
    }).observe(element);
}

export function random_quote<T extends Element>(target: T, quotes: string[]) {
    target.innerHTML = quotes[Math.floor(Math.random() * quotes.length)]
}

export function glitch(element: HTMLElement, timeSpan = 0.5) {
    PowerGlitch.glitch(element,
        {
            "playMode": "always",
            "createContainers": true,
            "timing": {
                "duration": 500,
                "iterations": 1,
            },
            "glitchTimeSpan": {
                "start": 0,
                "end": timeSpan
            },
            "shake": {
                "velocity": 15,
                "amplitudeX": 0.1,
                "amplitudeY": 0.1
            },
            "slice": {
                "count": 6,
                "velocity": 15,
                "minHeight": 0.02,
                "maxHeight": 0.15,
                "hueRotate": true
            },
            "pulse": false
        });
}

export function parallax<T extends Element>(element: T, speed: number) {
    Rellax(element, {
        speed: speed,
        center: true,
        round: true,
        vertical: true,
    });
}

