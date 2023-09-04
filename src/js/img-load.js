export default () => {
    /// Projects
    const projects = document.querySelectorAll(".project");

    function handleImageLoad(el) {
        el.classList.add("loaded");
        el.classList.remove("loading");
        el.removeEventListener("load", handleImageLoad);
    }

    projects.forEach((project) => {
        // Must apply classes to imgLink instead of img
        // in order for ::after element (loading state) to work
        const imgLink = project.querySelector(".img-link");
        imgLink.classList.add("loading");

        const img = imgLink.querySelector("img");

        if (img.naturalHeight > 0) {
            handleImageLoad(imgLink);
        } else {
            img.addEventListener("load", () => {
                handleImageLoad(imgLink);
            });
        }
    });

    /// Tech Stack:
    const techStackImgs = document.querySelectorAll(".tech-stack img");

    techStackImgs.forEach((img) => {
        img.classList.add("loading");

        if (img.naturalHeight > 0) {
            // Image is already loaded:
            handleImageLoad(img);
        } else {
            img.addEventListener("load", () => {
                handleImageLoad(img);
            });
        }
    });
};
