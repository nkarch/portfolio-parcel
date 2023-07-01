const projects = require("./src/data/projects.json");
const techStack = require("./src/data/tech-stack.json");

module.exports = {
    plugins: {
        "posthtml-include": {
            root: "./src",
        },
        "posthtml-expressions": {
            locals: {
                projects,
                techStack,
            },
        },
    },
};
