import Editor from "./editor";

let style = document.createElement('style');
// @ts-ignore
style.innerText = STYLES;
document.head.appendChild(style);

export const editor = Editor;