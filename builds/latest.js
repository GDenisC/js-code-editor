/* Code Editor version: 1.0.0 by DenisC
   MIT license */
"use strict";var editor=(()=>{var a=Object.defineProperty;var d=Object.getOwnPropertyDescriptor;var o=Object.getOwnPropertyNames;var c=Object.prototype.hasOwnProperty;var g=(s,t)=>{for(var e in t)a(s,e,{get:t[e],enumerable:!0})},m=(s,t,e,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of o(t))!c.call(s,n)&&n!==e&&a(s,n,{get:()=>t[n],enumerable:!(i=d(t,n))||i.enumerable});return s};var v=s=>m(a({},"__esModule",{value:!0}),s);var f={};g(f,{editor:()=>E});var u=class{constructor(t,e,i){this.editor=t;this.tag=document.createElement("div"),this.tag.className="editor-line",this.tag.appendChild(this.span=document.createElement("span")),this.tag.appendChild(this.input=document.createElement("input")),this.span.className="editor-id",this.input.className="editor-input",this.setId(e),this.setValue(i),this.input.addEventListener("keydown",n=>{var h,p;n.key=="Enter"&&this.input.selectionStart!=null?(console.log(this.input.value.length,this.input.selectionStart),this.editor.newLine(this.id,this.input.value.length==this.input.selectionStart?"    ":this.input.value.slice(this.input.selectionStart)),this.input.value=this.input.value.slice(0,this.input.selectionStart),this.editor.lines[this.id].input.selectionStart=4,this.editor.lines[this.id].input.selectionEnd=4):n.key=="Backspace"&&this.input.selectionStart==0?this.editor.removeLine(this.id-1,this.input.value):n.key=="ArrowUp"?(h=this.editor.lines[this.id-2])==null||h.input.focus():n.key=="ArrowDown"&&((p=this.editor.lines[this.id])==null||p.input.focus())})}get id(){return parseInt(this.span.innerText)}setId(t){this.span.innerText=t.toString()}setValue(t){this.input.value=t}},l=class{constructor(t){this.tag=document.createElement("div");this.lines=[];for(let e=0;e<t.length;++e)this.lines.push(new u(this,e+1,t[e]))}newLine(t,e){let i=new u(this,0,e);this.lines.splice(t,0,i),this.update(),i.input.focus(),i.input.selectionStart=0,i.input.selectionEnd=0}removeLine(t,e){if(this.lines.length==1)return;this.lines.splice(t,1),this.update();let i=this.lines[t-1];i&&(i.input.focus(),i.input.value+=" ",i.input.value+=e,i.input.selectionStart=i.input.value.length-e.length,i.input.selectionEnd=i.input.value.length-e.length)}update(){this.tag.innerHTML="";for(let t=0;t<this.lines.length;++t){let e=this.lines[t];e.setId(t+1),this.tag.appendChild(e.tag)}}attach(t){this.tag.className="editor-body",t.appendChild(this.tag),this.update()}};var r=document.createElement("style");r.innerText=".editor-body {    background-color: rgb(28, 28, 28);    overflow: auto;}.editor-line {    display: flex;    align-items: center;    padding: 3px;}.editor-line:hover {    background-color: rgb(40, 40, 40);}.editor-id,.editor-input {    color: rgb(230, 230, 230);    font: bold 16px monospace;}.editor-id {    width: 30px;}.editor-input {    flex: 1;    margin: 0;    padding: 0;    border: 0;    background-color: transparent;}.editor-input:focus {    outline: none;}";document.head.appendChild(r);var E=l;return v(f);})();
