class Line {
    tag: HTMLDivElement;
    span: HTMLSpanElement;
    input: HTMLInputElement;

    constructor(public editor: Editor, id: number, value: string) {
        this.tag = document.createElement('div');
        this.tag.className = 'editor-line';
        this.tag.appendChild(this.span = document.createElement('span'));
        this.tag.appendChild(this.input = document.createElement('input'));
        this.span.className = 'editor-id';
        this.input.className = 'editor-input';
        this.setId(id);
        this.setValue(value);

        this.input.addEventListener('keydown', e => {
            if (e.key == 'Enter' && this.input.selectionStart != null) {
                this.editor.newLine(this.id, this.input.value.slice(this.input.selectionStart));
                this.input.value = this.input.value.slice(0, this.input.selectionStart);
            } else if (e.key == 'Backspace' && this.input.selectionStart == 0) {
                this.editor.removeLine(this.id - 1, this.input.value);
            } else if (e.key == 'ArrowUp') {
                this.editor.lines[this.id - 2]?.input.focus();
            } else if (e.key == 'ArrowDown') {
                this.editor.lines[this.id]?.input.focus();
            }
        });
    }

    get id() {
        return parseInt(this.span.innerText);
    }

    setId(id: number) {
        this.span.innerText = id.toString();
    }

    setValue(value: string) {
        this.input.value = value;
    }
}

export default class Editor {
    tag = document.createElement('div');
    lines: Line[] = [];

    constructor(source: string[]) {
        for (let i = 0; i < source.length; ++i) {
            this.lines.push(new Line(this, i + 1, source[i]));
        }
    }

    newLine(index: number, content: string) {
        let line = new Line(this, 0, content);
        this.lines.splice(index, 0, line);
        this.update();
        line.input.focus();
        line.input.selectionStart = 0;
        line.input.selectionEnd = 0;
    }

    removeLine(index: number, content: string) {
        if (this.lines.length == 1) return;
        this.lines.splice(index, 1);
        this.update();
        let line = this.lines[index - 1];
        if (!line) return;
        line.input.focus();
        line.input.value += ' ';
        line.input.value += content;
        line.input.selectionStart = line.input.value.length - content.length;
        line.input.selectionEnd = line.input.value.length - content.length;
    }

    update() {
        this.tag.innerHTML = '';
        for (let i = 0; i < this.lines.length; ++i) {
            let line = this.lines[i];
            line.setId(i + 1);
            this.tag.appendChild(line.tag);
        }
    }

    attach(node: Node) {
        this.tag.className = 'editor-body';
        node.appendChild(this.tag);
        this.update();
    }
}