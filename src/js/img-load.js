export default () => {
    const projects = document.querySelectorAll(".project");

    projects.forEach((project) => {
        const imgTrigger = project.querySelector(".img-trigger");
        imgTrigger.classList.add("loading");

        const img = imgTrigger.querySelector("img");

        if (img.naturalHeight > 0) {
            img.parentElement.classList.add("loaded");

            setTimeout(() => {
                img.parentElement.classList.remove("loading");
            }, 1000);
        } else {
            img.addEventListener("load", (e) => {
                const imgParent = e.target.parentElement;
                imgParent.classList.add("loaded");

                setTimeout(() => {
                    imgParent.classList.remove("loading");
                }, 1000);
            });
        }
    });
};
