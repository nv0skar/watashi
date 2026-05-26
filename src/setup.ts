// Whoami
// Copyright (C) 2026 Oscar Alvarez Gonzalez

import * as config from "./config";
import * as app from "./app";
import * as router from "./router";

export function header(always_background: router.Route) {
    let threshold = window.innerHeight / 2;
    let position = 0;

    if (window.scrollY <= threshold) {
        if (router.current_page() != always_background) {
            app.title.hidden = true;
        }
    }
    window.addEventListener(
        "scroll",
        () => {
            if (Math.abs(window.scrollY - position) >= 15) {
                if (position <= window.scrollY && window.scrollY > 0) {
                    if (app.header.hidden && window.scrollY >= threshold) {
                        app.header.classList.add("header_hidden");
                    }
                } else {
                    if (app.header.hidden) {
                        app.header.hidden = false;
                    }
                }
            }
            if (!app.header.hidden) {
                if (window.scrollY >= threshold) {
                    if (router.current_page() != always_background) {
                    }
                    app.title.hidden = false;
                } else {
                    if (router.current_page() != always_background) {
                        app.title.hidden = true;
                    }
                }
            }
            position = window.scrollY;
        },
        { passive: true },
    );
}
