// whoami
// Copyright (C) 2023 Oscar

import * as config from "./config";
import * as app from "./app";
import * as effects from "./effects";

import DOMPurify from "dompurify";
import { marked } from "marked";
import { Octokit } from "octokit";


const octokit = new Octokit({ userAgent: "whoami" })

export function fetch_articles(override_title: string | undefined = undefined) {
    const list = document.createElement("div");
    list.className = "list";
    app.blog.appendChild(list);
    const title = document.createElement("h1");
    if (override_title !== undefined)
        title.innerHTML = override_title;
    else title.innerHTML = "Blog";
    list.appendChild(title);
    const subtitle = document.createElement("span");
    list.appendChild(subtitle);
    const gallery = document.createElement("div");
    gallery.className = "gallery";
    list.appendChild(gallery);
    subtitle.innerHTML = "Fetching...";
    octokit.rest.gists.listForUser({
        username: config.USERNAME
    }).then((response) => {
        response.data.forEach((article) => {
            if (article.description === null)
                return;
            if (article.description.substring(0, config.ARTICLE_PREFIX.length) == config.ARTICLE_PREFIX) {
                console.log("ok")
                for (const gallery_article of gallery.childNodes) {
                    const link = (gallery_article as HTMLElement).getAttribute("href")!;
                    if (link.substring((link.length - article.id.length), link.length) == article.id) {
                        return
                    }
                }
                const container = document.createElement("a")
                const title = document.createElement("h3");
                title.innerHTML = article.description.substring((config.ARTICLE_PREFIX.length + 1), article.description.length);
                const created = document.createElement("p");
                created.innerHTML = new Date(article.created_at).toDateString();
                container.href = "/blog/" + article.id;
                container.appendChild(title)
                container.appendChild(created);
                gallery.appendChild(container);
            }
        })
        if (gallery.childNodes.length == 0) {
            subtitle.innerHTML = "There aren't any articles yet!"
        } else {
            subtitle.hidden = true;
        }
    }).catch((error) => {
        console.error("Unable to fetch blog!", error);
        subtitle.innerHTML = "Cannot fetch the blog!";
    })
}

export function load_article(articleId: string) {
    const article = document.createElement("div");
    article.className = "article";
    app.blog.appendChild(article);
    const about = document.createElement("div");
    about.className = "info";
    article.appendChild(about);
    const renderer = document.createElement("article");
    article.appendChild(renderer);
    const footer = document.createElement("div");
    footer.className = "info";
    article.appendChild(footer);
    renderer.innerHTML = "Loading article ✨"
    octokit.rest.gists.get({ gist_id: articleId }).then((article) => {
        const name = document.createElement("strong");
        const date = document.createElement("p");
        const comments = document.createElement("span");
        const link = document.createElement("a");
        name.innerHTML = article.data.description!.substring((config.ARTICLE_PREFIX.length + 1), article.data.description!.length);
        date.innerHTML = new Date(article.data.created_at!).toDateString();
        comments.innerHTML = "💬 " + article.data.comments + " ● ";
        link.innerHTML = "Comment on GitHub";
        link.setAttribute("href", article.data.html_url!);
        link.rel = "noopener noreferrer";
        link.target = "_blank";
        about.appendChild(name);
        about.appendChild(date);
        footer.appendChild(comments);
        footer.appendChild(link);
        renderer.innerHTML = ""
        Object.values(article.data.files!).forEach((file) => {
            const fileCanvas = document.createElement("div");
            const filename = document.createElement("span");
            const fileRender = document.createElement("div");
            fileCanvas.classList.add("canvas");
            filename.classList.add("info");
            filename.innerHTML = file!.filename!;
            fileRender.innerHTML = DOMPurify.sanitize(marked.parse(file!.content!));
            fileCanvas.appendChild(filename);
            fileCanvas.appendChild(fileRender);
            renderer.appendChild(fileCanvas);
        })
    }).catch((error) => {
        console.error("Cannot load the article!", error);
        renderer.innerHTML = "Cannot load the article!";
    })
}