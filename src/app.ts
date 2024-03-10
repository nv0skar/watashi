// whoami
// Copyright (C) 2023 Oscar

import * as router from "./router";
import * as setup from "./setup";
import * as effects from "./effects";

import page from "page";

export const header = document.querySelector("header")!;

export const title = header.getElementsByTagName("h1")![0];

export const about = document.getElementById("about")!;
export const blog = document.getElementById("blog")!;


window.onload = () => {
    page()
    document.getElementById("tracker")!.setAttribute("data-beampipe-domain", window.location.hostname);
    document.getElementById("footerYear")!.innerHTML = ((new Date()).getUTCFullYear()).toString();
    setup.header(router.Route.Blog);
    effects.parallax(document.getElementById("intro_background")!, -10);
    effects.fade(Array.from(document.getElementById("about")!.querySelectorAll("h1")!), "content_hidden");
    loading_done(document.querySelector("page-loader")!, "loader_hidden", "disableScrolling");
}

export function loading_done(loader: HTMLElement, hidden_class: string, disable_scrolling: string) {
    setTimeout(() => {
        if (window.scrollY == 0) {
            document.querySelector("body")!.classList.add(disable_scrolling);
            loader.classList.add(hidden_class);
            setTimeout(() => {
                loader.hidden = true;
                document.querySelector("body")!.classList.remove(disable_scrolling);
            }, (getComputedStyle(loader).getPropertyValue("--animationDuration").slice(0, -1) as any) as number * 500);
        } else {
            loader.hidden = true;
        }
    }, 200);
}
