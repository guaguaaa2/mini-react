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

// 实现fiber框架
let nextWorkOfUnit = null;
let root = null;
function render(el, container) {
    // parent节点
    nextWorkOfUnit = {
        dom: container,
        props: {
            children: [el]
        }
    }
    // 对根节点进行初始化
    root = nextWorkOfUnit;

    // let dom = el.type === "TEXT_NODE"
    //     ? document.createTextNode("")
    //     : document.createElement(el.type);

    // Object.keys(el.props).forEach(key => {
    //     if (key !== "children") {
    //         dom[key] = el.props[key];
    //     }
    // })
    // let children = el.props.children;
    // children.forEach(child => {
    //     render(child, dom);
    // })
    // container.append(dom);
}
let taskId = 1
function workLoop(deadline) {
    taskId++
    let shouldField = deadline.timeRemaining() > 1;
    while (shouldField && nextWorkOfUnit !== null) {
        console.log(`taskId:${taskId} task running`)
        nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
        // 如果dom树已遍历完全，则退出循环
        console.log("nextWorkOfUnit:", nextWorkOfUnit);
        if (deadline.timeRemaining() < 1) {
            shouldField = !shouldField;
        }
    }
    if (nextWorkOfUnit === null && root !== null) {
        commitRoot();
    }
    // 浏览器空闲时调用workloop函数
    requestIdleCallback(workLoop)

}
// 浏览器空闲时调用workloop函数
requestIdleCallback(workLoop);
function commitRoot() {
    commitWork(root.child);
    root = null;
}
function commitWork(work) {
    if (work === null) return;
    work.parent.dom.append(work.dom);
    commitWork(work.child);
}
function performWorkOfUnit(work) {
    // 1. 创建dom
    if (!work.dom) {
        const dom = work.type === "TEXT_NODE" ?
            document.createTextNode("") :
            document.createElement(work.type);
        work.dom = dom;
        // 将其加入到父容器中，如:<parent>
        //                          <child></child>
        //                      </parent>
        console.log("dom:", dom);
        console.log("work.parent.dom:", work.parent.dom);
        // work.parent.dom.append(dom)

        console.log("after append work.parent.dom:", work.parent.dom);
        // 2. props
        Object.keys(work.props).forEach(key => {
            if (key !== "children")
                dom[key] = work.props[key];
        })
        console.log("after setting work.parent.dom:", work.parent.dom);
    }
    // 3. dom树返回链式结构
    let preChild = null;
    work.props.children.forEach((child, index) => {
        const newWorkUnit = {
            type: child.type,
            props: child.props,
            child: null,
            parent: work,
            sibling: null,
            dom: null
        }
        if (index === 0) {
            work.child = newWorkUnit;
        } else {
            preChild.sibling = newWorkUnit;
        }
        preChild = newWorkUnit;

    })
    // 4. 返回下一个任务work
    // 如果当前work存在子节点，则返回子节点
    if (work.child) {
        console.log("work.child:", work.child)
        return work.child
    }
    // 如果当前work没有子节点，且兄弟节点存在，则直接兄弟节点
    if (work.sibling) {
        console.log("work.sibling:", work.sibling)
        return work.sibling
    }
    // 如果既没有子节点也无兄弟节点，则返回父节点的兄弟节点
    console.log("work.parent.sibling:", work.parent.sibling)
    return work.parent.sibling
}

const React = {
    render,
    createElement
}
export default React;