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

import { finshLoad, headerBehaviour, statusSet, appearingSection, dynamicContent, whoAmI, randomQuote, parallax, finishLoad } from "./effects.js"

window.onload = () => {
  document.getElementById("tracker").setAttribute("data-beampipe-domain", window.location.hostname); // Set website's hostname for tracker
  document.getElementById("footerYear").innerHTML = ((new Date()).getUTCFullYear()); // Set current year on footer
  headerBehaviour(document.querySelector("header"), document.getElementById("head")); // Set up header behaviour
  statusSet(document.getElementById("statusContent")); // Set up scrolling status bar
  whoAmI(document.getElementById("introText")) // Start typing effect for intro
  randomQuote(document.getElementById("contactSubtitle")); // Set random quote for contact's subtitle
  parallax('#headTitleContainer', -1); // Set parallax effect for title
  parallax('#headBackground', -2.5); // Set parallax effect for background
  appearingSection("sectionHidden"); // Appearing effect for sections
  dynamicContent(); // React to dynamic contents
  finishLoad(document.querySelector("loader"), "loaderHidden", "disableScrolling"); // Hide loader
}
