function createTextNode(text) {
    return {
        type: "TEXT_NODE",
        props: {
            textContent: text,
            children: []
        }
    }
}

function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map(child => {
                return typeof child === "string" ? createTextNode(child) : child
            })
        }
    }
}

function render(el, container) {
    let dom = el.type === "TEXT_NODE"
        ? document.createTextNode("")
        : document.createElement(el.type);

    Object.keys(el.props).forEach(key => {
        if (key !== "children") {
            dom[key] = el.props[key];
        }
    })
    let children = el.props.children;
    children.forEach(child => {
        render(child, dom);
    })
    container.append(dom);
}
const React = {
    render,
    createElement
}

export default React;