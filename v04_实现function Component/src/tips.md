# 实现 fiber 框架

### 1. 空闲调用
利用函数 requestIdleCallback(callback)在浏览器空闲时调用 callback 函数，在调用 callback 函数时，将自动创建 IdleDeadline 类型的输入参数，该类型提供了 timeRemaining()方法，来获取浏览器预计空闲时间

   ```js
   let taskId = 1;
   function workLoop(deadline) {
     taskId++;
     let shouldField = deadline.timeRemaining() > 1;
     while (shouldField && nextWorkOfUnit !== null) {
       console.log(`taskId:${taskId} task running`);
       nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
       // 如果dom树已遍历完全，则退出循环
       console.log("nextWorkOfUnit:", nextWorkOfUnit);
       if (deadline.timeRemaining() < 1) {
         shouldField = !shouldField;
       }
     }
     // 浏览器空闲时调用workloop函数
     requestIdleCallback(workLoop);
   }
   // 浏览器空闲时调用workloop函数
    requestIdleCallback(workLoop);
   ```

### 2.深度遍历dom树
#### 1. 定义新的结构类型
每个节点都可能存在父节点、子节点以及兄弟节点，同时将虚拟dom的其他属性赋值，dom属性表示真实dom
```js
const newWorkUnit = {
    type: child.type,
    props: child.props,
    child: null,
    parent: work,
    sibling: null,
    dom: null
}
```  
*父节点container传入时为真实dom,首次传入结构如下：*  

```js
    nextWorkOfUnit = {
        dom: container,
        props: {
            children: [el]
        }
    }
```  
#### 2. `performWorkOfUnit(work)`
1. 读入传入的work，如果work存在真实dom，则不处理，若不存在，则根据type创建真实dom，并加入到父容器中
2. 将虚拟dom中的props，如id值、文本内容加入到真实dom中进行渲染
```js
const dom = work.type === "TEXT_NODE" ?
    document.createTextNode(""):
    document.createElement(work.type);
work.dom = dom;
// 将其加入到父容器中，如:<parent>
//                          <child></child>
//                      </parent>
console.log("dom:", dom);
console.log("work.parent.dom:", work.parent.dom);
work.parent.dom.append(dom)

console.log("after append work.parent.dom:", work.parent.dom);
// 2. props
Object.keys(work.props).forEach(key => {
    if (key !== "children")
        dom[key] = work.props[key];
})
```
3. 将dom树进行深度遍历
```js
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
```
4. 返回下一个节点
```js
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
```
### 3.统一提交  
防止出现渲染出现卡顿，在创建完所有真实dom后，再统一将子节点加入到父容器中，统一渲染到页面上  
```js
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
```
```js
if (nextWorkOfUnit === null && root !== null) {
    commitRoot();
}
```
```js
function commitRoot() {
    commitWork(root.child);
    root = null;
}
function commitWork(work) {
    if (work === null) return;
    work.parent.dom.append(work.dom);
    commitWork(work.child);
}
```