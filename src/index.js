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
    document.getElementById("tracker").setAttribute("data-beampipe-domain", window.location.hostname);
    document.getElementById("footerYear").innerHTML = ((new Date()).getUTCFullYear());
    effect.headerBehaviour(document.querySelector("header"), "blog", document.getElementById("status"));
    effect.statusSet(document.getElementById("statusContent"));
    effect.ribbon(document.getElementById("ribbonTitle"));
    effect.randomQuote(document.getElementById("contactSubtitle"));
    effect.parallax('#introTitleContainer', -1);
    effect.parallax('#introBackground', -5);
    effect.appearingContent([document.getElementById("summary"), document.getElementById("contact")], "contentHidden");
    effect.dynamicContent();
    effect.finishLoad(document.querySelector("page-loader"), "loaderHidden", "disableScrolling");
}
