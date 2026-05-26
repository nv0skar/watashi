// Whoami
// Copyright (C) 2026 Oscar Alvarez Gonzalez

import * as posts from "./posts";
import * as app from "./app";
import * as config from "./config";

import page from "page";

export enum Route {
    About,
    Posts,
}

export let current_page = () => {
    if (!app.about.hidden) return Route.About;
    else return Route.Posts;
};

const setup_route = {
    posts: () => {
        app.posts.hidden = false;
        app.about.hidden = true;
        app.title.hidden = false;
        app.posts.textContent = "";
    },
    about: () => {
        app.about.hidden = false;
        app.posts.hidden = true;
        app.title.hidden = true;
        app.posts.textContent = "";
    },
};

function change_header_route(text: string, route: string) {
    const selector = document.getElementById("modeSelector")!;
    selector.innerHTML = text;
    selector.setAttribute("href", route);
}

page("/posts", () => {
    setup_route.posts();
    change_header_route("About", "/");
    posts.fetch_posts();
});

page("/posts/:id", (ctx) => {
    setup_route.posts();
    change_header_route("Other articles", "/posts");
    posts.load_article(ctx.params.id);
    window.scrollTo(0, 0);
});

page("*", () => {
    setup_route.about();
    change_header_route("Posts", "/posts");
});
