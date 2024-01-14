import ReactDom from "./src/ReactDom.js"
import app from "./App.js";

ReactDom.creatRoot(document.querySelector('#root')).render(app);
// function workLoop(deadline){
//     console.log(deadline.timeRemaining());
// }

// requestIdleCallback(workLoop)