import React from "./React.js";
const ReactDom = {
    creatRoot(root) {
        return {
            render(el) {
                React.render(el, root);
            }
        }
    }
}
export default ReactDom;