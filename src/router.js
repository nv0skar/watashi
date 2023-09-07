// whoami
// Copyright (C) 2022 Oscar
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import * as blog from "./blog.js";
import page from "page";

export let currentPage = () => {
    if (!document.getElementById("about-me").hidden) return "about-me"
    else return "blog"
};

const changePage = {
    blog: () => {
        document.getElementById("blog").hidden = false;
        document.getElementById("status").hidden = true;
        document.getElementById("about-me").hidden = true;
    },
    aboutMe: () => {
        document.getElementById("status").hidden = false;
        document.getElementById("about-me").hidden = false;
        document.getElementById("blog").hidden = true;
    }
}

function changeSelector(text, href) {
    const selector = document.getElementById("modeSelector");
    selector.innerHTML = "→ " + text;
    selector.setAttribute('href', href);
}

page('/blog', () => {
    changePage.blog();
    document.getElementById("blogNote").hidden = true;
    changeSelector("about me 👋", "/")
    document.getElementById("blogListTitle").innerHTML = "Blog";
    blog.clearNote(document.getElementById("blogNote"))
    blog.fetchNotes(document.getElementById("blogListSelector"), document.getElementById("blogListSubtitle"));
});

page('/blog/:id', (ctx) => {
    changePage.blog();
    document.getElementById("blogNote").hidden = false;
    changeSelector("blog's index 🗒️", "/blog")
    document.getElementById("blogListTitle").innerHTML = "Other notes";
    blog.loadNote(ctx.params.id, document.getElementById("blogNote"))
    blog.fetchNotes(document.getElementById("blogListSelector"), document.getElementById("blogListSubtitle"));
    window.scrollTo(0, 0);
});

page('*', () => {
    changePage.aboutMe();
    changeSelector("blog ✍️", "/blog")
    blog.clearNote(document.getElementById("blogNote"))
});

page()