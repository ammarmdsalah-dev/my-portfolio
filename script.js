/* =====================================================
   script.js - JavaScript for Ammar's Portfolio
   
   What this file does:
   1. Hamburger menu open/close
   2. Scroll-to-top button show/hide
   3. Active nav link highlight on scroll
   4. Scroll-in fade animation for cards
   5. Skill progress bar animation
   6. Contact form validation
   7. Typing effect on hero title
===================================================== */


/* =====================================================
   1. HAMBURGER MENU
   
   When the user clicks the hamburger button:
   - Show/hide the mobile nav dropdown
   - Animate the button into an X shape
===================================================== */

/* Get the hamburger button by its id */
var hamburger = document.getElementById("hamburger");

/* Get the mobile nav menu by its id */
var mobileNav = document.getElementById("mobile-nav");

/* Listen for a click on the hamburger button */
hamburger.addEventListener("click", function () {

    /* Check if the mobile nav is currently hidden */
    if (mobileNav.style.display === "block") {

        /* If it is visible, hide it */
        mobileNav.style.display = "none";

        /* Remove the "open" class so the button goes back to 3 lines */
        hamburger.classList.remove("open");

    } else {

        /* If it is hidden, show it */
        mobileNav.style.display = "block";

        /* Add the "open" class so the button animates into an X */
        hamburger.classList.add("open");
    }
});


/* Get all the mobile nav links so we can close the menu when one is clicked */
var mobileLinks = document.getElementsByClassName("mobile-link");

/* Loop through all mobile links and add a click listener to each one */
/* i is a counter, mobileLinks.length is how many links there are */
for (var i = 0; i < mobileLinks.length; i++) {

    mobileLinks[i].addEventListener("click", function () {

        /* Close the menu */
        mobileNav.style.display = "none";

        /* Reset the hamburger icon back to 3 lines */
        hamburger.classList.remove("open");
    });
}


/* =====================================================
   2. SCROLL TO TOP BUTTON
   
   Show the button when user scrolls down more than 300px.
   When clicked, scroll back to the top smoothly.
===================================================== */

/* Get the scroll-to-top button */
var scrollBtn = document.getElementById("scroll-top");

/* window.addEventListener("scroll") runs every time the page scrolls */
window.addEventListener("scroll", function () {

    /* window.scrollY = how many pixels the user has scrolled down */
    if (window.scrollY > 300) {

        /* Show the button */
        scrollBtn.style.display = "block";

    } else {

        /* Hide the button */
        scrollBtn.style.display = "none";
    }
});

/* When the button is clicked, scroll to the top */
scrollBtn.addEventListener("click", function () {

    /* scrollTo with behavior "smooth" makes it animate instead of jump */
    window.scrollTo({ top: 0, behavior: "smooth" });
});


/* =====================================================
   3. ACTIVE NAV LINK ON SCROLL
   
   As the user scrolls, find which section is visible
   and highlight the matching nav link in blue.
===================================================== */

/* Get all nav links inside .navegation */
var navLinks = document.querySelectorAll(".navegation a");

/* Get all sections that have an id attribute */
var sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", function () {

    /* Loop through every section */
    for (var i = 0; i < sections.length; i++) {

        var section = sections[i];

        /* getBoundingClientRect() tells us where the element is on screen right now */
        /* rect.top = distance from top of screen to top of element */
        var rect = section.getBoundingClientRect();

        /* If the section is near the top of the screen */
        if (rect.top <= 100 && rect.bottom >= 100) {

            /* Remove active-link from ALL nav links first */
            for (var j = 0; j < navLinks.length; j++) {
                navLinks[j].classList.remove("active-link");
            }

            /* Find the nav link whose href matches this section id */
            /* For example: section id="services" → href="#services" */
            var matchingLink = document.querySelector('.navegation a[href="#' + section.id + '"]');

            /* If we found a matching link, highlight it */
            if (matchingLink !== null) {
                matchingLink.classList.add("active-link");
            }
        }
    }
});


/* =====================================================
   4. SCROLL-IN FADE ANIMATION
   
   Cards start invisible (opacity:0 in CSS).
   When a card enters the screen, we add class "visible"
   which triggers the CSS transition to fade it in.
   
   We use IntersectionObserver - it watches elements
   and calls a function when they appear on screen.
===================================================== */

/* Create the observer */
/* The function runs when a watched element enters or leaves the screen */
var cardObserver = new IntersectionObserver(function (entries) {

    /* entries = list of elements being watched */
    for (var i = 0; i < entries.length; i++) {

        var entry = entries[i];

        /* entry.isIntersecting = true when element is on screen */
        if (entry.isIntersecting === true) {

            /* Add "visible" class → CSS makes it fade in and slide up */
            entry.target.classList.add("visible");

            /* Stop watching this element - we only animate it once */
            cardObserver.unobserve(entry.target);
        }
    }

}, {
    /* threshold: 0.15 means trigger when 15% of the element is visible */
    threshold: 0.15
});

/* Get all elements with class "animate-card" and tell the observer to watch them */
var animateCards = document.getElementsByClassName("animate-card");

for (var i = 0; i < animateCards.length; i++) {
    cardObserver.observe(animateCards[i]);
}


/* =====================================================
   5. SKILL BAR ANIMATION
   
   Each skill bar has a data-level attribute in HTML.
   Example: <div class="skill-bar" data-level="75">
   
   When the skill item becomes visible, we read that
   number and set the bar width to it (like 75%).
===================================================== */

var skillObserver = new IntersectionObserver(function (entries) {

    for (var i = 0; i < entries.length; i++) {

        var entry = entries[i];

        if (entry.isIntersecting === true) {

            /* Find the .skill-bar element inside this skill item */
            var bar = entry.target.querySelector(".skill-bar");

            if (bar !== null) {

                /* Read the data-level attribute value */
                /* dataset.level reads data-level="75" and gives us "75" */
                var level = bar.dataset.level;

                /* Wait 400ms then animate the bar width */
                /* This delay makes it animate after the card fades in */
                setTimeout(function (b, l) {
                    return function () {
                        /* Set width to the level value, like "75%" */
                        b.style.width = l + "%";
                    };
                }(bar, level), 400);
            }

            skillObserver.unobserve(entry.target);
        }
    }

}, { threshold: 0.2 });

/* Watch all skill items */
var skillItems = document.getElementsByClassName("skill-item");

for (var i = 0; i < skillItems.length; i++) {
    skillObserver.observe(skillItems[i]);
}


/* =====================================================
   6. CONTACT FORM VALIDATION
   
   When the Send button is clicked:
   - Check all fields are filled in
   - Check email has @ and . in it
   - Show success message if everything is ok
   - Clear the form after sending
===================================================== */

/* Get the send button and attach a click listener */
var sendBtn = document.getElementById("send-btn");

sendBtn.addEventListener("click", function () {

    /* Get the value the user typed in each field */
    /* .value reads what is inside an input */
    /* .trim() removes any spaces at the start or end */
    var name    = document.getElementById("name").value.trim();
    var email   = document.getElementById("email").value.trim();
    var message = document.getElementById("message").value.trim();

    /* Check if name is empty */
    if (name === "") {
        alert("Please enter your name.");
        return; /* stop here, do not continue */
    }

    /* Check if email is empty */
    if (email === "") {
        alert("Please enter your email.");
        return;
    }

    /* Simple email check - must have @ and . */
    /* indexOf returns -1 if the character is not found */
    if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
        alert("Please enter a valid email address.");
        return;
    }

    /* Check if message is empty */
    if (message === "") {
        alert("Please write a message.");
        return;
    }

    /* If we get here, all fields are valid */
    /* Show the green success message */
    var successMsg = document.getElementById("success-msg");
    successMsg.style.display = "block";

    /* Clear all the input fields */
    document.getElementById("name").value    = "";
    document.getElementById("email").value   = "";
    document.getElementById("message").value = "";

    /* Hide the success message after 4 seconds (4000 milliseconds) */
    setTimeout(function () {
        successMsg.style.display = "none";
    }, 4000);
});


/* =====================================================
   7. TYPING EFFECT
   
   Types "Web Developer" one letter at a time
   in the hero section span.
   
   How it works:
   - We have a variable charIndex starting at 0
   - Every 100ms we add the next letter to the span
   - We stop when we have added all letters
===================================================== */

/* The element where the text will appear */
var typingEl = document.getElementById("typing-text");

/* The full text we want to type */
var typingText = "Web Developer";

/* Start with empty text */
typingEl.textContent = "";

/* Which character we are on right now (starts at 0) */
var charIndex = 0;

/* This function adds one letter then calls itself again */
function typeWriter() {

    /* If we have not reached the end yet */
    if (charIndex < typingText.length) {

        /* charAt(index) gets the letter at that position */
        /* For example: "Web Developer".charAt(0) = "W" */
        typingEl.textContent = typingEl.textContent + typingText.charAt(charIndex);

        /* Move to the next letter */
        charIndex = charIndex + 1;

        /* Call this function again after 100ms */
        /* This creates the typing effect */
        setTimeout(typeWriter, 100);
    }
}

/* Start the typing effect after 1 second (1000ms) */
/* This gives the page time to load first */
setTimeout(typeWriter, 1000);
