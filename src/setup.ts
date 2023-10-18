// whoami
// Copyright (C) 2023 Oscar

import * as config from "./config";
import * as router from "./router";
import * as effects from "./effects";

export function header(header: HTMLElement, always_background: router.Route, status_bar: HTMLElement) {
    let transparentHeight = window.innerHeight / 4;
    let lastPosition = 0;
    if (window.scrollY <= transparentHeight) {
        status_bar.classList.remove("statusShow");
        if (router.current_page() != always_background) {
            header.classList.remove("headerBackground");
        }
    }
    window.addEventListener('scroll', () => {
        if (Math.abs(window.scrollY - lastPosition) >= 15) {
            if (lastPosition <= window.scrollY && window.scrollY > 0) {
                if (!header.hidden && window.scrollY >= transparentHeight) {
                    effects.glitch(header);
                    header.hidden = true
                }
            } else {
                if (header.hidden) {
                    header.hidden = false
                    effects.glitch(header);
                }
            }
        }
        if (!header.hidden) {
            if (window.scrollY >= transparentHeight) {
                if (router.current_page() != always_background) {
                    status_bar.classList.add("statusShow");
                }
                header.classList.add("headerBackground")
            } else {
                status_bar.classList.remove("statusShow");
                if (router.current_page() != always_background) {
                    header.classList.remove("headerBackground")
                }
            }
        }
        lastPosition = window.scrollY;
    }, { passive: true });
}

export function status(status_bar: HTMLElement) {
    let completeText = "";
    const encapsulateSpaces = (char, size) => {
        const spaces = " ".repeat(size);
        return spaces + char + spaces
    }
    config.STATUS.forEach((state) => {
        completeText = completeText.concat(completeText != "" ? encapsulateSpaces("●", 5) : "").concat(state);
    })
    status_bar.innerHTML = completeText;
}
