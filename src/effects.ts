// whoami
// Copyright (C) 2023 Oscar

import Typewriter from 'typewriter-effect/dist/core';
import GraphemeSplitter from "grapheme-splitter";
import Rellax from "rellax";
import { PowerGlitch } from "powerglitch";

export function section_fade<T extends Element>(elements: T[], animation: string) {
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
    const splitter = (string) => {
        const splitter = new GraphemeSplitter();
        return splitter.splitGraphemes(string);
    };
    let effect = new Typewriter(element, {
        cursor: "_",
        delay: 50,
        loop: true,
        stringSplitter: splitter
    });
    phrases.forEach((phrase) => {
        effect.typeString(phrase).pauseFor(1000).deleteAll();
    })
    const onScreen = new IntersectionObserver((elements) => {
        elements.forEach((element) => {
            if (element.isIntersecting) {
                effect.start()
            } else {
                effect.stop()
            }
        })
    }, {
        threshold: 1.0
    });
    onScreen.observe(element);
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

