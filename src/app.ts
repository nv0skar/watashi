// Whoami
// Copyright (C) 2026 Oscar Alvarez Gonzalez

import * as router from "./router";
import * as setup from "./setup";

import page from "page";

export const header = document.querySelector("header")!;

export const title = header.getElementsByTagName("h1")![0];

export const about = document.getElementById("about")!;
export const posts = document.getElementById("posts")!;

let main = () => {
    page();
    document
        .getElementById("tracker")!
        .setAttribute("data-beampipe-domain", window.location.hostname);
    document.getElementById("footerYear")!.innerHTML = new Date()
        .getUTCFullYear()
        .toString();
    setup.header(router.Route.Posts);
};

window.addEventListener("load", main);
