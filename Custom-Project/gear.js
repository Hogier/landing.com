document.addEventListener("DOMContentLoaded", function () {
    let images = document.querySelectorAll(".testimonial-content .content-action .gear");

    window.addEventListener("scroll", function () {
        let angle = window.scrollY * 0.12; 

        if (images[0]) {
            images[0].style.transform = "rotate(" + (-angle) + "deg)";
            images[0].style.transformOrigin = "center center";
        }
        if (images[1]) {
            images[1].style.transform = "rotate(" + angle + "deg)";
            images[1].style.transformOrigin = "center center";
        }
        if (images[2]) {
            images[2].style.transform = "rotate(" + (-angle) + "deg)";
            images[2].style.transformOrigin = "center center";
        }
        if (images[3]) {
            images[3].style.transform = "rotate(" + (angle) + "deg)";
            images[3].style.transformOrigin = "center center";
        }
    });
});