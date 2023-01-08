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

import "./router.js";
import * as effect from "./effects.js";

window.onload = () => {
    document.getElementById("tracker").setAttribute("data-beampipe-domain", window.location.hostname); // Set website's hostname for tracker
    document.getElementById("footerYear").innerHTML = ((new Date()).getUTCFullYear()); // Set current year on footer
    effect.headerBehaviour(document.querySelector("header"), "notepad", document.getElementById("status")); // Set up header behaviour
    effect.statusSet(document.getElementById("statusContent")); // Set text of scrolling bar
    effect.whoAmI(document.getElementById("introTitle")) // Start typing effect for intro
    effect.randomQuote(document.getElementById("contactSubtitle")); // Set random quote for contact's subtitle
    effect.parallax('#introTitleContainer', -1); // Set parallax effect for title
    effect.parallax('#introBackground', -2.5); // Set parallax effect for background
    effect.appearingContent([document.getElementById("summary"), document.getElementById("contact")], "contentHidden"); // Appearing effect for the summary and contact sections
    effect.dynamicContent(); // React to dynamic contents
    effect.finishLoad(document.querySelector("page-loader"), "loaderHidden", "disableScrolling"); // Hide loader
}
