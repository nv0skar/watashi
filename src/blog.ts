// whoami
// Copyright (C) 2023 Oscar

import * as config from "./config";
import * as app from "./app";
import * as effects from "./effects";

import DOMPurify from "dompurify";
import { marked } from "marked";
import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ userAgent: "whoami" })

export function fetch_articles(override_title: string | undefined = undefined) {
    const list = document.createElement("div");
    list.className = "list";
    app.blog.appendChild(list);
    const title = document.createElement("h1");
    if (override_title !== undefined)
        title.innerHTML = override_title;
    else effects.random_quote(title, config.BLOQ_QUOTES);
    list.appendChild(title);
    const subtitle = document.createElement("span");
    list.appendChild(subtitle);
    const gallery = document.createElement("div");
    gallery.className = "gallery";
    list.appendChild(gallery);
    subtitle.innerHTML = "🌪️ Wait a minute 🌪️";
    octokit.gists.listForUser({
        username: config.USERNAME
    }).then((response) => {
        response.data.forEach((note) => {
            if (note.description === null)
                return;
            if (note.description.substring(0, config.NOTE_PREFIX.length) == config.NOTE_PREFIX) {
                for (const article of gallery.childNodes) {
                    const link = (article as HTMLElement).getAttribute("href")!;
                    if (link.substring((link.length - note.id.length), link.length) == note.id) {
                        return
                    }
                }
                const container = document.createElement("a")
                const title = document.createElement("h3");
                title.innerHTML = note.description.substring((config.NOTE_PREFIX.length + 1), note.description.length);
                const created = document.createElement("p");
                created.innerHTML = "Created at " + (new Date(note.created_at).toDateString());
                const comments = document.createElement("p");
                comments.innerHTML = (note.comments == 0 ? "No comments yet!" : (note.comments + " comment" + (note.comments == 1 ? "" : "s")));
                container.href = "/blog/" + note.id;
                container.appendChild(title)
                container.appendChild(created);
                container.appendChild(comments);
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
        subtitle.innerHTML = "😱 There was an error while trying to fetch the blog! 😱";
    })
}

export function load_article(noteId: string) {
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
    renderer.innerHTML = "Loading note ✨"
    octokit.gists.get({ gist_id: noteId }).then((note) => {
        const name = document.createElement("strong");
        const date = document.createElement("p");
        const comments = document.createElement("span");
        const link = document.createElement("a");
        name.innerHTML = note.data.description!.substring((config.NOTE_PREFIX.length + 1), note.data.description!.length);
        date.innerHTML = "Created at " + (new Date(note.data.created_at!).toDateString());
        comments.innerHTML = "💬 " + note.data.comments + " ● ";
        link.innerHTML = "You can go to GitHub to comment!";
        link.setAttribute("href", note.data.html_url!);
        link.rel = "noopener noreferrer";
        link.target = "_blank";
        about.appendChild(name);
        about.appendChild(date);
        footer.appendChild(comments);
        footer.appendChild(link);
        renderer.innerHTML = ""
        Object.values(note.data.files!).forEach((file) => {
            const fileCanvas = document.createElement("div");
            const filename = document.createElement("span");
            const fileRender = document.createElement("div");
            fileCanvas.classList.add("canvas");
            filename.classList.add("info");
            filename.innerHTML = file!.filename!;
            fileRender.innerHTML = DOMPurify.sanitize(marked.parse(file!.content));
            fileCanvas.appendChild(filename);
            fileCanvas.appendChild(fileRender);
            renderer.appendChild(fileCanvas);
        })
    }).catch((error) => {
        console.error("Unable to load note!", error);
        renderer.innerHTML = "😱 There was an error while trying to load the note! 😱";
    })
}