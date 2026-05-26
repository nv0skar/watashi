// Whoami
// Copyright (C) 2026 Oscar Alvarez Gonzalez

import * as config from "./config";
import * as app from "./app";

import DOMPurify from "dompurify";
import { marked } from "marked";
import { Octokit } from "octokit";

const octokit = new Octokit({ userAgent: "whoami" });

export function fetch_posts(override_title: string | undefined = undefined) {
    const list = document.createElement("div");
    list.className = "list";
    app.posts.appendChild(list);
    const title = document.createElement("h1");
    if (override_title !== undefined) title.innerHTML = override_title;
    else title.innerHTML = "Posts";
    list.appendChild(title);
    const subtitle = document.createElement("span");
    list.appendChild(subtitle);
    const gallery = document.createElement("div");
    gallery.className = "gallery";
    list.appendChild(gallery);
    subtitle.innerHTML = "Fetching...";
    octokit.rest.gists
        .listForUser({
            username: config.USERNAME,
        })
        .then((response) => {
            response.data.forEach((post) => {
                if (post.description === null) return;
                if (
                    post.description.substring(0, config.POST_PREFIX.length) ==
                    config.POST_PREFIX
                ) {
                    for (const gallery_post of gallery.childNodes) {
                        const link = (gallery_post as HTMLElement).getAttribute(
                            "href",
                        )!;
                        if (
                            link.substring(
                                link.length - post.id.length,
                                link.length,
                            ) == post.id
                        ) {
                            return;
                        }
                    }
                    const container = document.createElement("a");
                    const title = document.createElement("h3");
                    title.innerHTML = post.description.substring(
                        config.POST_PREFIX.length + 1,
                        post.description.length,
                    );
                    const created = document.createElement("p");
                    created.innerHTML = new Date(
                        post.created_at,
                    ).toDateString();
                    container.href = "/posts/" + post.id;
                    container.appendChild(title);
                    container.appendChild(created);
                    gallery.appendChild(container);
                }
            });
            if (gallery.childNodes.length == 0) {
                subtitle.innerHTML = "There aren't any posts yet!";
            } else {
                subtitle.hidden = true;
            }
        })
        .catch((error) => {
            console.error("Cannot fetch posts.", error);
            subtitle.innerHTML = "Cannot fetch the posts.";
        });
}

export function load_article(articleId: string) {
    const article = document.createElement("div");
    article.className = "article";
    app.posts.appendChild(article);
    const about = document.createElement("div");
    about.className = "info";
    article.appendChild(about);
    const renderer = document.createElement("article");
    article.appendChild(renderer);
    const footer = document.createElement("div");
    footer.className = "info";
    article.appendChild(footer);
    renderer.innerHTML = "Loading article ✨";
    octokit.rest.gists
        .get({ gist_id: articleId })
        .then((post) => {
            const name = document.createElement("strong");
            const date = document.createElement("p");
            name.innerHTML = post.data.description!.substring(
                config.POST_PREFIX.length + 1,
                post.data.description!.length,
            );
            date.innerHTML = new Date(post.data.created_at!).toDateString();
            about.appendChild(name);
            about.appendChild(date);
            renderer.innerHTML = "";
            Object.values(post.data.files!).forEach((file) => {
                const fileCanvas = document.createElement("div");
                const filename = document.createElement("span");
                const fileRender = document.createElement("div");
                fileCanvas.classList.add("canvas");
                filename.classList.add("info");
                filename.innerHTML = file!.filename!;
                fileRender.innerHTML = DOMPurify.sanitize(
                    marked.parse(file!.content!),
                );
                fileCanvas.appendChild(filename);
                fileCanvas.appendChild(fileRender);
                renderer.appendChild(fileCanvas);
            });
        })
        .catch((error) => {
            console.error("Cannot load the post!", error);
            renderer.innerHTML = "Cannot load the post!";
        });
}
