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

import * as notepad from "./notepad.js";
import page from "page";

export let currentPage = () => {
    if (!document.getElementById("about-me").hidden) return "about-me"
    else return "notepad"
};

const changePage = {
    notepad: () => {
        document.getElementById("notepad").hidden = false;
        document.getElementById("about-me").hidden = true;
    },
    aboutMe: () => {
        document.getElementById("about-me").hidden = false;
        document.getElementById("notepad").hidden = true;
    }
}

function changeSelector(text, href) {
    const selector = document.getElementById("modeSelector");
    selector.innerHTML = "→ " + text;
    selector.setAttribute('href', href);
}

page('/notepad', () => {
    changePage.notepad();
    document.getElementById("notepadNote").hidden = true;
    changeSelector("about me 👋", "/")
    document.getElementById("notepadListTitle").innerHTML = "Notepad";
    notepad.clearNote(document.getElementById("notepadNote"))
    notepad.fetchNotes(document.getElementById("notepadListSelector"), document.getElementById("notepadListSubtitle"));
});

page('/notepad/:id', (ctx) => {
    changePage.notepad();
    document.getElementById("notepadNote").hidden = false;
    changeSelector("notepad's index 🗒️", "/notepad")
    document.getElementById("notepadListTitle").innerHTML = "Other notes";
    notepad.loadNote(ctx.params.id, document.getElementById("notepadNote"))
    notepad.fetchNotes(document.getElementById("notepadListSelector"), document.getElementById("notepadListSubtitle"));
    window.scrollTo(0, 0);
});

page('*', () => {
    changePage.aboutMe();
    changeSelector("notepad ✍️", "/notepad")
    notepad.clearNote(document.getElementById("notepadNote"))
});

page()