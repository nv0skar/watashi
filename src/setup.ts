// whoami
// Copyright (C) 2023 Oscar

import * as config from "./config";
import * as router from "./router";
import * as effects from "./effects";

export function header(header: HTMLElement, always_background: router.Route, status_bar: HTMLElement) {
    let transparentHeight = window.innerHeight / 4;
    let lastPosition = 0;
    if (window.scrollY <= transparentHeight) {
        status_bar.classList.remove("status_visible");
        if (router.current_page() != always_background) {
            header.classList.remove("header_background");
        }
    }
    window.addEventListener('scroll', () => {
        if (Math.abs(window.scrollY - lastPosition) >= 15) {
            if (lastPosition <= window.scrollY && window.scrollY > 0) {
                if (!header.classList.contains("header_hidden") && window.scrollY >= transparentHeight) {
                    header.classList.add("header_hidden");
                }
            } else {
                if (header.classList.contains("header_hidden")) {
                    header.classList.remove("header_hidden");
                }
            }
        }
        if (!header.hidden) {
            if (window.scrollY >= transparentHeight) {
                if (router.current_page() != always_background) {
                    status_bar.classList.add("status_visible");
                }
                header.classList.add("header_background")
            } else {
                status_bar.classList.remove("status_visible");
                if (router.current_page() != always_background) {
                    header.classList.remove("header_background")
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
