const tokens = {
    space: /^\s+/,
    identifier: /^[a-zA-Z_][a-zA-Z0-9_]*/,
    string: /^"(?:[^"\\\\]|\\\\.)*"/,
    equal: /^=/,
    lbrace: /^{/,
    rbrace: /^}/,
    lbracket: /^\[/,
    rbracket: /^\]/,
    comma: /^,/
};

type Token = [keyof typeof tokens, string];

const tokenize = (text: string) => {
    const result: Token[] = [];
    while (text.length) {
        let found = false;
        for (const t in tokens) {
            let key = t as keyof typeof tokens;
            let regex = tokens[key].exec(text);
            if (regex) {
                if (t != 'space') result.push([key, regex[0]]);
                text = text.slice(regex[0].length);
                found = true;
                break;
            }
        }
        if (!found) throw new Error('Syntax error for ' + text);
    }
    return result;
}

interface Ast<T extends string = string> {
    type: T
}

interface Identifier extends Ast<'identifier'> {
    name: string
}

interface Value extends Ast<'value'> {
    value: string
}

interface Array extends Ast<'array'> {
    content: Tag[]
}

interface TagComponent extends Ast<'component'> {
    entry: Identifier,
    value: Array | Value
}

interface TagStruct extends Ast<'struct'> {
    content: TagComponent[]
}

interface Tag extends Ast<'tag'> {
    id: Identifier,
    struct: TagStruct
}

class AST {
    offset = 0;

    constructor(public tokens: Token[]) {}

    parseTag() {
        return {
            type: 'tag',
            id: this.parseIdentifier(),
            struct: this.parseStruct()
        } as Tag;
    }

    parseIdentifier() {
        let token = this.next();
        if (token[0] != 'identifier') throw new Error('Expected identifier');
        return {
            type: 'identifier',
            name: token[1]
        } as Identifier;
    }

    parseStruct() {
        let str = { type: 'struct', content: [] } as TagStruct;
        if (this.next()[0] != 'lbrace') throw new Error('Expected {');
        let next;
        do {
            str.content.push(this.parseComponent());
            next = this.next();
        } while (next[0] == 'comma');
        if (next[0] != 'rbrace') throw new Error('Expected }');
        return str;
    }

    parseComponent() {
        let entry = this.parseIdentifier();
        let equal = this.next();
        if (equal[0] != 'equal') throw new Error('Expected =');
        let value = entry.name == 'children' ? this.parseArray() : this.parseValue()
        return { type: 'component', entry, value } as TagComponent;
    }

    parseValue() {
        let token = this.next();
        if (token[0] != 'string') throw new Error('Expected string');
        return {
            type: 'value',
            value: token[1].slice(1, -1)
        } as Value;
    }

    parseArray() {
        if (this.next()[0] != 'lbracket') throw new Error('Expected [');
        let arr = { type: 'array', content: [] } as Array;
        let comma;
        do {
            arr.content.push(this.parseTag());
            comma = this.next();
        } while (comma[0] == 'comma');
        if (comma[0] != 'rbracket') throw new Error('Expected ]');
        return arr;
    }

    next() {
        return this.tokens[this.offset++];
    }
}

const getHtmlFromAst = (ast: Tag) => {
    let tag = document.createElement(ast.id.name);
    let children = ast.struct.content;
    for (let child of children) {
        if (child.entry.name == 'children') {
            for (let ast of (child.value as Array).content) {
                tag.appendChild(getHtmlFromAst(ast));
            }
        } else if (child.entry.name == 'innerText') {
            tag.innerText = (child.value as Value).value;
        } else {
            tag.setAttribute(child.entry.name, (child.value as Value).value);
        }
    }
    return tag;
}

const mergeTemplate = (template: TemplateStringsArray, args: any[]) => {
    let result = '';
    let i = 0, len = args.length;
    for (; i < len; ++i) {
        result += template[i] + '"' + args[i] + '"';
    }
    result += template[i];
    return result;
}

const parse = (raw: TemplateStringsArray, ...args: any[]) => {
    let result = mergeTemplate(raw, args);
    let ast = new AST(tokenize(result));
    return getHtmlFromAst(ast.parseTag());
};

export default parse;