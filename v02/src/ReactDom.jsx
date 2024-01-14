import react from "./React.jsx";
const ReactDom = {
    creatRoot(root) {
        return {
            render(el) {
                react.render(el, root);
            }
        }
    }
}
export default ReactDom;