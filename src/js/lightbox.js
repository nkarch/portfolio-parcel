import { v4 as uuidv4 } from "uuid";

export default () => {
    const projectsSection = document.querySelector(".projects");
    const projects = projectsSection.querySelectorAll(".project");

    let scrollbarWidth = getScrollbarWidth();
    const r = document.querySelector(":root");
    r.style.setProperty("--scrollbar-width", scrollbarWidth + "px");

    const MODAL_BUTTONS = [
        { label: "Close", slug: "close", innerText: "×", click: closeModal },
        {
            label: "Previous Project",
            slug: "prev",
            innerText: "Prev",
            hidden: true,
            click: changeProject,
        },
        {
            label: "Next Project",
            slug: "next",
            innerText: "Next",
            hidden: true,
            click: changeProject,
        },
    ];

    function generateModalButtons() {
        const buttonElements = [];

        MODAL_BUTTONS.forEach((buttonData) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = buttonData.slug;
            button.id = `modal-${buttonData.slug}`;
            button.ariaLabel = buttonData.label;
            button.addEventListener("click", (e) => buttonData.click(buttonData.slug));

            if (buttonData.innerText) {
                const span = document.createElement("span");
                span.innerText = buttonData.innerText;

                if (buttonData.hidden) {
                    span.hidden = true;
                }

                button.appendChild(span);
            }

            buttonElements.push(button);
        });

        return buttonElements;
    }

    function generateImgMarkup(project) {
        let img = new Image();

        img.srcset = project.dataset.srcset;
        img.src = project.dataset.src;
        img.className = "modal-content";
        img.Id = "modal-img";
        img.alt = null;

        return img;
    }

    function handleModalKeyDown({ modal, e }) {
        switch (e.key) {
            case "Tab": {
                if (e.target.id === "modal-close" && e.shiftKey) {
                    e.preventDefault();
                    modal.querySelector("#modal-next")?.focus();
                } else if (e.target.id === "modal-next" && !e.shiftKey) {
                    e.preventDefault();
                    modal.querySelector("#modal-close")?.focus();
                }
                break;
            }
            case "Escape": {
                closeModal(modal);
                break;
            }
            case "ArrowLeft": {
                e.preventDefault();
                changeProject("prev");
                break;
            }
            case "ArrowRight": {
                e.preventDefault();
                changeProject("next");
                break;
            }
        }
    }

    // In root scope so functions can access same instance
    let keydownCallback;

    function generateModalMarkup(project) {
        const modal = document.createElement("div");
        modal.id = "img-modal";
        modal.className = "modal";
        modal.dataset.projectSlug = project.dataset.projectSlug;

        const modalButtons = generateModalButtons();
        modalButtons.forEach((button) => {
            modal.appendChild(button);
        });

        const loading = document.createElement("div");
        loading.classList.add("loading-spinner");
        modal.prepend(loading);

        const img = project.querySelector("img");
        const imgElement = generateImgMarkup(project);

        imgElement.onload = () => {
            modal.appendChild(imgElement);
            loading.remove();
        };

        keydownCallback = (e) => handleModalKeyDown({ modal, e });
        modal.addEventListener("keydown", keydownCallback);

        return modal;
    }

    function getScrollbarWidth() {
        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
        return scrollBarWidth;
    }

    function closeModal() {
        const modal = document.querySelector("#img-modal");
        const currentSlug = modal.dataset.projectSlug;

        if (keydownCallback) {
            modal.removeEventListener("keydown", keydownCallback);
        }

        modal.style.opacity = "0";

        setTimeout(() => {
            if (window.matchMedia("(hover: hover)").matches) {
                document.body.style.overflow = "auto";
                document.body.style.paddingRight = 0;
            }

            modal.remove();

            // Return focus to corresponding project img-link
            document
                .querySelector(`.project[data-project-slug="${currentSlug}"] .img-link`)
                ?.focus();
        }, 250); // Match CSS opacity transition
    }

    function getAdjacentProject({ direction, currentProject }) {
        // Get project by direction and current slug
        let newProject = null;
        const projects = document.querySelectorAll(`.project`);
        const projectsArray = Array.from(projects);
        const currentIndex = projectsArray.indexOf(currentProject);

        if (direction === "next") {
            if (currentIndex < projectsArray.length - 1) {
                newProject = projectsArray[currentIndex + 1];
            } else {
                newProject = projectsArray[0];
            }
        } else if (direction === "prev") {
            if (currentIndex > 0) {
                newProject = projectsArray[currentIndex - 1];
            } else {
                newProject = projectsArray[projectsArray.length - 1];
            }
        }

        return newProject;
    }

    function changeProject(direction) {
        const modal = document.querySelector("#img-modal");

        const currentSlug = modal.dataset.projectSlug;
        const currentProject = document.querySelector(
            `.project[data-project-slug="${currentSlug}"]`
        );

        const newProject = getAdjacentProject({ direction, currentProject });

        if (newProject) {
            modal.dataset.projectSlug = newProject.dataset.projectSlug;
            const loading = document.createElement("div");
            loading.classList.add("loading-spinner");
            modal.prepend(loading);
            modal.querySelector(".modal-content").remove();

            const imgElement = generateImgMarkup(newProject);

            imgElement.onload = () => {
                modal.appendChild(imgElement);
                loading.remove();
            };
        }
    }

    function showModal(project) {
        const modal = generateModalMarkup(project);

        projectsSection.appendChild(modal);

        modal.querySelector("#modal-close").focus();

        if (window.matchMedia("(hover: hover)").matches) {
            document.body.style.overflow = "hidden";
            document.body.style.paddingRight = scrollbarWidth + "px";
        }
    }

    function generateProjectSlug(name) {
        return name ? name.toLowerCase().replace(" ", "-").replace(".", "-") : uuidv4();
    }

    projects.forEach((project) => {
        const name = project.querySelector(".h")?.innerText;
        // Generate slug for modal to reference
        const slug = generateProjectSlug(name);

        if (slug) {
            const imgLink = project.querySelector(".img-link");

            project.setAttribute("data-project-slug", slug);

            imgLink.addEventListener("click", (e) => {
                e.preventDefault();
                showModal(project);
            });
        }
    });

    window.addEventListener("resize", () => {
        scrollbarWidth = getScrollbarWidth();
    });
};
