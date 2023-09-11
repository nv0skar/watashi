// whoami
// Copyright (C) 2023 Oscar

import * as router from "./router";
import * as config from "./config";
import * as setup from "./setup";
import * as effects from "./effects";

import page from "page";

export const status_bar = document.getElementById("status")!;

export const about_me = document.getElementById("about-me")!;
export const blog = document.getElementById("blog")!;


window.onload = () => {
    page()
    document.getElementById("tracker")!.setAttribute("data-beampipe-domain", window.location.hostname);
    document.getElementById("footerYear")!.innerHTML = ((new Date()).getUTCFullYear()).toString();
    setup.header(document.querySelector("header")!, router.Route.Blog, document.getElementById("status")!);
    setup.status(document.getElementById("statusContent")!);
    effects.writing(document.getElementById("ribbonWriter")!);
    effects.random_quote(document.getElementById("contactSubtitle")!, config.CONTACT_QUOTES);
    effects.parallax(document.getElementById("introTitleContainer")!, -1);
    effects.parallax(document.getElementById("introBackground")!, -5);
    effects.section_fade([document.getElementById("ribbon")!, document.getElementById("summary")!, document.getElementById("contact")!], "contentHidden");
    finish_load(document.querySelector("page-loader")!, "loaderHidden", "disableScrolling");
}

export function finish_load(loader: HTMLElement, hidden_class: string, disable_scrolling: string) {
    setTimeout(() => {
        if (window.scrollY == 0) {
            document.querySelector("body")!.classList.add(disable_scrolling);
            loader.classList.add(hidden_class);
            setTimeout(() => {
                loader.hidden = true;
                document.querySelector("body")!.classList.remove(disable_scrolling);
            }, (getComputedStyle(loader).getPropertyValue("--animationDuration").slice(0, -1) as any) as number * 1000);
        } else {
            loader.hidden = true;
        }
    }, 200);
}
