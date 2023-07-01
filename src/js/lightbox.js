export default () => {
    function getScrollbarWidth() {
        return window.innerWidth - document.documentElement.clientWidth;
    }

    let scrollbarWidth = getScrollbarWidth();

    const projects = document.querySelectorAll(".project");
    const modal = document.getElementById("img-modal");
    const modalImg = document.getElementById("modal-img");
    const modalClose = document.getElementById("modal-close");

    projects.forEach((project) => {
        const imgTrigger = project.querySelector(".img-trigger");
        const img = imgTrigger.querySelector("img");

        imgTrigger.addEventListener("click", (e) => {
            e.preventDefault();
            modalImg.src = img.dataset.src;
            modalImg.srcset = img.dataset.srcset;
            modal.style.display = "block";
            modal.style.position = "fixed";

            if (window.matchMedia("(hover: hover)").matches) {
                document.body.style.overflow = "hidden";
                document.body.style.paddingRight = scrollbarWidth + "px";
            }
        });
    });

    if (modal) modal.onclick = (e) => closeModal(e);
    if (modalClose) modalClose.onclick = (e) => closeModal(e);

    function closeModal(e) {
        if (e.target.id == "modal-img") return;

        modal.style.opacity = "0";

        setTimeout(() => {
            if (window.matchMedia("(hover: hover)").matches) {
                document.body.style.overflow = "auto";
                document.body.style.paddingRight = 0;
            }

            modal.style.display = "none";
            modal.style.opacity = "";
        }, 250);
    }

    window.addEventListener("resize", () => {
        scrollbarWidth = getScrollbarWidth();
    });
};
