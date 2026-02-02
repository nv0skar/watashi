// Whoami
// Copyright (C) 2026 Oscar Alvarez Gonzalez

import * as config from "./config";
import * as app from "./app";
import * as router from "./router";
import * as effects from "./effects";

export function header(always_background: router.Route) {
    let threshold = window.innerHeight / 2;
    let position = 0;


    if (window.scrollY <= threshold) {
        if (router.current_page() != always_background) {
            app.header.classList.remove("header_background");
            app.title.hidden = true;
        }
    }
    window.addEventListener('scroll', () => {
        if (Math.abs(window.scrollY - position) >= 15) {
            if (position <= window.scrollY && window.scrollY > 0) {
                if (!app.header.classList.contains("header_hidden") && window.scrollY >= threshold) {
                    app.header.classList.add("header_hidden");
                }
            } else {
                if (app.header.classList.contains("header_hidden")) {
                    app.header.classList.remove("header_hidden");
                }
            }
        }
        if (!app.header.hidden) {
            if (window.scrollY >= threshold) {
                if (router.current_page() != always_background) {
                }
                app.header.classList.add("header_background")
                app.title.hidden = false;

            } else {
                if (router.current_page() != always_background) {
                    app.header.classList.remove("header_background")
                    app.title.hidden = true;

                }
            }
        }
        position = window.scrollY;
    }, { passive: true });
}
