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
//3
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import * as config from "./config.js";
import DOMPurify from "dompurify";
import { marked } from "marked";
import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ userAgent: "whoami" })

export function fetchNotes(list, errorTarget) {
    errorTarget.innerHTML = "Notes are on the way! 🌪️";
    octokit.gists.listForUser({
        username: config.username
    }).then((response) => {
        response.data.forEach((note) => {
            if (note.description.substring(0, config.notePrefix.length) == config.notePrefix) {
                for (const displayedNote of list.childNodes) {
                    if (displayedNote.href.substring((displayedNote.href.length - note.id.length), displayedNote.href.length) == note.id) {
                        return
                    }
                }
                const container = document.createElement("a")
                const title = document.createElement("h3");
                const created = document.createElement("p");
                const comments = document.createElement("p");
                title.innerHTML = note.description.substring((config.notePrefix.length + 1), note.description.length);
                created.innerHTML = "Created at " + (new Date(note.created_at).toDateString());
                comments.innerHTML = (note.comments == 0 ? "No comments yet!" : (note.comments + " comment" + (note.comments == 1 ? "" : "s")));
                container.href = "/notepad/" + note.id;
                container.appendChild(title)
                container.appendChild(created);
                container.appendChild(comments);
                list.appendChild(container);
            }
        })
        if (list.childNodes.length == 0) {
            errorTarget.innerHTML = "There aren't any notes yet!"
        } else {
            errorTarget.hidden = true;
        }
    }).catch((error) => {
        console.error("Unable to fetch notepad!", error);
        errorTarget.innerHTML = "😱 there was an error while trying to fetch the notepad!";
    })
}

export function clearNote(parentTarget) {
    const infoTarget = document.getElementById(parentTarget.id + "About");
    const renderTarget = document.getElementById(parentTarget.id + "Canvas");
    const footerTarget = document.getElementById(parentTarget.id + "Footer");
    infoTarget.innerHTML = "";
    renderTarget.innerHTML = "";
    footerTarget.innerHTML = "";
}

export function loadNote(noteId, parentTarget) {
    clearNote(parentTarget);
    const infoTarget = document.getElementById(parentTarget.id + "About");
    const renderTarget = document.getElementById(parentTarget.id + "Canvas");
    const footerTarget = document.getElementById(parentTarget.id + "Footer");
    renderTarget.innerHTML = "Loading note ✨"
    octokit.gists.get({ gist_id: noteId }).then((note) => {
        const name = document.createElement("strong");
        const date = document.createElement("p");
        const comments = document.createElement("span");
        const link = document.createElement("a");
        name.innerHTML = note.data.description.substring((config.notePrefix.length + 1), note.data.description.length);
        date.innerHTML = "Created at " + (new Date(note.data.created_at).toDateString());
        comments.innerHTML = "💬 " + note.data.comments + " ● ";
        link.innerHTML = "You can go to GitHub to comment!";
        link.href = note.data.html_url;
        link.rel = "noopener noreferrer";
        link.target = "_blank";
        infoTarget.appendChild(name);
        infoTarget.appendChild(date);
        footerTarget.appendChild(comments);
        footerTarget.appendChild(link);
        renderTarget.innerHTML = ""
        Object.values(note.data.files).forEach((file) => {
            const fileCanvas = document.createElement("div");
            const filename = document.createElement("span");
            const fileRender = document.createElement("div");
            fileCanvas.classList.add("canvas");
            filename.classList.add("info");
            filename.innerHTML = file.filename;
            fileRender.innerHTML = DOMPurify.sanitize(marked.parse(file.content));
            fileCanvas.appendChild(filename);
            fileCanvas.appendChild(fileRender);
            renderTarget.appendChild(fileCanvas);
        })
    }).catch((error) => {
        console.error("Unable to load note!", error);
        renderTarget.innerHTML = "😱 there was an error while trying to load the note!";
    })
}