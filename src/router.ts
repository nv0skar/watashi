// Whoami
// Copyright (C) 2026 Oscar Alvarez Gonzalez

import * as blog from "./blog";
import * as app from "./app";
import * as config from "./config";

import page from "page";

export enum Route {
    AboutMe,
    Blog
}

export let current_page = () => {
    if (!app.about.hidden) return Route.AboutMe
    else return Route.Blog
};

const setup_route = {
    blog: () => {
        app.blog.hidden = false;
        app.about.hidden = true;
        app.title.hidden = false;
        app.blog.textContent = "";
    },
    about: () => {
        app.about.hidden = false;
        app.blog.hidden = true;
        app.title.hidden = true;
        app.blog.textContent = "";
    }
}

function change_header_route(text: string, route: string) {
    const selector = document.getElementById("modeSelector")!;
    selector.innerHTML = "→ " + text;
    selector.setAttribute('href', route);
}


page('/blog', () => {
    setup_route.blog();
    change_header_route("about me", "/")
    blog.fetch_articles();
});

page('/blog/:id', (ctx) => {
    setup_route.blog();
    change_header_route("blog's index 🗒️", "/blog")
    blog.load_article(ctx.params.id)
    blog.fetch_articles("Other articles");
    window.scrollTo(0, 0);
});

page('*', () => {
    setup_route.about();
    change_header_route("blog ✍️", "/blog")
});
