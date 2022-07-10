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

// Defining animations
const animations = {
  appear: (element, easing = "easeOutQuart", delay = 200) => {
    element.progress = 0
    anime({
      targets: element,
      progress: 1,
      easing: easing,
      duration: 500,
      delay: delay,
      autoplay: true,
      update: () => {
        element.style.setProperty("opacity", element.progress); // Set the opacity
      }
    })
  },
  underline: (element, easing = "easeOutQuart", width = undefined, delay = 450) => {
    element.progress = "0%"
    anime({
      targets: element,
      progress: (width == undefined) ? getComputedStyle(element).getPropertyValue("--underlineMaxWidth") : width, // Check if a custom width was passed,
      easing: easing,
      duration: 500,
      delay: delay,
      autoplay: true,
      update: () => {
        element.style.setProperty("--underlineWidth", element.progress); // Set the underline's width
      }
    })
  }
}

// Defining the loading and arrow animations
const predefinedAnimations = {
  loading: anime({
    targets: document.getElementsByTagName("loader").item(0),
    scaleX: 0,
    delay: 250,
    autoplay: false,
    easing: "easeInQuint",
    begin: () => {
      document.body.style["overflow"] = "hidden"; // Disable scrolling while load screen animation is displayed
    },
    complete: () => {
      document.getElementsByTagName("loader").item(0).style.display = "none"; // Hide the element
      document.body.style["overflow"] = "scroll"; // Re-enable scrolling
      animations.underline(document.getElementById("head-title"), "spring(1, 100, 15, 0)", "100%") // Start main title's underline animation
      predefinedAnimations.arrow.play(); // Start arrow's animation
    }
  }),
  arrow: anime({
    targets: document.getElementById("intro-arrow"),
    bottom: "-0.5rem",
    direction: "alternate",
    loop: true,
    autoplay: false,
    easing: "easeOutQuad"
  })
}

// Defining observed elements
const observedElements = new IntersectionObserver((entries) => {
  for (entry of entries) {
    if (entry.isIntersecting) {
      // Don't play animation if the element is set not to do so
      if (!element.getAttribute("data-ignore")) {
        if (entry.target.tagName.toLowerCase() == "section") {
          animations.appear(entry.target);
          observedElements.unobserve(entry.target);
        } else if (entry.target.tagName.toLowerCase() == "h1") {
          animations.underline(entry.target)
          observedElements.unobserve(entry.target);
        }
      } else {
        observedElements.unobserve(entry.target)
      }
    }
  }
})

// Helper function that registers an observer to animatable elements
const registerObserver = (sections = true) => {
  // Registers an event listener that triggers when a title is in the viewport
  for (element of document.getElementsByTagName("h1")) {
    if (!element.getAttribute("data-ignore")) {
      element.style.setProperty("--underlineWidth", "0"); // Set the underline's width to none
      observedElements.observe(element)
    }
  }

  // Registers an event listener that triggers when a section is in the viewport
  if (sections) {
    for (element of document.getElementsByTagName("section")) {
      if (!element.getAttribute("data-ignore")) {
        element.style.setProperty("opacity", 0); // Set the element transparent
        observedElements.observe(element)
      }
    }
  }
}

// Helper function for changing the text of an hovered element
const changeOnHover = (element) => {
  const defaultText = element.innerHTML;
  element.innerHTML = element.getAttribute("data-origin");
  element.onmouseleave = function () {
    element.innerHTML = defaultText // Register an event for setting again the default text when the mouse is no longer hovering
  }
}

// Defining behaviour when scrolling
const onScroll = () => {
  // If load animation is still being played, skip it if the scrolling Y-Axis is not 0, also section animations will be disabled
  if (window.scrollY != 0 && !predefinedAnimations.loading.completed) {
    predefinedAnimations.loading.seek(predefinedAnimations.loading.duration);
    registerObserver(false); // Register animatable elements to be observed
    window.removeEventListener("scroll", onScroll); // No longer needed to listen to scroll events
  } else {
    registerObserver(); // Register animatable elements to be observed
    window.removeEventListener("scroll", onScroll); // No longer needed to listen to scroll events
  }
}


window.addEventListener("load", () => {
  document.getElementById("head-title").style.setProperty("--underlineWidth", "0%"); // Set title's underline's width to 0
  predefinedAnimations.loading.play(); // Playing load finished animation
})

window.addEventListener("scroll", onScroll)