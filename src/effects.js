// whoami
// Copyright (C) 2022 Oscar
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import * as config from "./config.js";
import { currentPage } from "./router.js";

import Typewriter from 'typewriter-effect/dist/core';
import GraphemeSplitter from "grapheme-splitter";
import Rellax from "rellax";
import { PowerGlitch } from "powerglitch";

export function finishLoad(element, targetClass, scrollingDisablingClass) {
    setTimeout(() => {
        if (window.scrollY == 0) {
            document.querySelector("body").classList.add(scrollingDisablingClass);
            element.classList.add(targetClass);
            setTimeout(() => {
                element.hidden = true;
                document.querySelector("body").classList.remove(scrollingDisablingClass);
            }, getComputedStyle(element).getPropertyValue("--animationDuration").slice(0, -1) * 1000);
        } else {
            element.hidden = true;
        }
    }, 400);
}

export function headerBehaviour(element, disableBackgroundRemoval, status) {
    let transparentHeight = window.innerHeight / 4;
    let lastPosition = 0;
    if (window.scrollY <= transparentHeight) {
        status.classList.remove("statusShow");
        currentPage()
        if (currentPage() != disableBackgroundRemoval) {
            element.classList.remove("headerBackground");
        }
    }
    window.addEventListener('scroll', () => {
        if (Math.abs(window.scrollY - lastPosition) >= 15) {
            if (lastPosition <= window.scrollY && window.scrollY > 0) {
                if (!element.hidden && window.scrollY >= transparentHeight) {
                    glitch(element);
                    element.hidden = true
                }
            } else {
                if (element.hidden) {
                    element.hidden = false
                    glitch(element);
                }
            }
        }
        if (!element.hidden) {
            if (window.scrollY >= transparentHeight) {
                if (currentPage() != disableBackgroundRemoval) {
                    status.classList.add("statusShow");
                }
                element.classList.add("headerBackground")
            } else {
                status.classList.remove("statusShow");
                if (currentPage() != disableBackgroundRemoval) {
                    element.classList.remove("headerBackground")
                }
            }
        }
        lastPosition = window.scrollY;
    }, { passive: true });
}

export function statusSet(element) {
    let completeText = "";
    const encapsulateSpaces = (char, size) => {
        const spaces = " ".repeat(size);
        return spaces + char + spaces
    }
    config.STATUS.forEach((state) => {
        completeText = completeText.concat(completeText != "" ? encapsulateSpaces("●", 5) : "").concat(state);
    })
    element.innerHTML = completeText;
}

export function appearingContent(elements, targetClass) {
    const onScreen = new IntersectionObserver((elements) => {
        elements.forEach((element) => {
            if (element.isIntersecting) {
                element.target.classList.remove(targetClass);
            }
        })
    }, {
        threshold: 0.1
    })
    elements.forEach((element) => {
        element.classList.add(targetClass);
        onScreen.observe(element)
    })
}

export function dynamicContent() {
    const onScreen = new IntersectionObserver((elements) => {
        elements.forEach((element) => {
            if (element.isIntersecting) {
                element.target.autoChange = setInterval(() => {
                    element.target.change()
                    setTimeout(() => {
                        element.target.reset()
                    }, 1000);
                }, 3000)
            } else {
                clearInterval(element.target.autoChange)
            }
        })
    }, {
        threshold: 1.0
    })
    for (const element of document.getElementsByClassName("change")) {
        const defaultContent = element.textContent;
        let glitchEffect = false;
        for (const elementClass of element.classList) {
            if (elementClass == "glitch") {
                glitchEffect = true
            }
        }
        element.change = () => {
            if (glitchEffect) {
                glitch(element);
            }
            element.textContent = element.getAttribute("data-to")
        };
        element.reset = () => {
            if (glitchEffect) {
                glitch(element);
            }
            element.textContent = defaultContent;
        }
        if (navigator.maxTouchPoints != 0) {
            onScreen.observe(element)
        } else {
            element.onmouseover = element.change;
            element.onmouseleave = element.reset;
        }
    }
}

export function ribbon(element) {
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
    config.RIBBON.forEach((phrase) => {
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

export function randomQuote(element) {
    element.innerHTML = config.QUOTES[Math.floor(Math.random() * config.QUOTES.length)]
}

export function glitch(element, timeSpan = 0.5) {
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

export function parallax(element, speed) {
    Rellax(element, {
        speed: speed,
        center: true,
        round: true,
        vertical: true,
    });
}
