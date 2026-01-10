import fs from 'fs-extra';

export function copyTemplate(src: string, path: string) {
    if (!fs.existsSync(src)) {
        console.warn(`⚠️ Template folder ${src} dosn't exist`);
        return;
    }
    fs.copySync(src, path, { overwrite: true });
}

export function patchAppFile(filePath: string, importLine: string, openTag: string, closeTag: string) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf-8');

    if (importLine) {
        content = content.replace('// [IMPORTS]', `${importLine}\n// [IMPORTS]`);
    }

    if (openTag) {
        if (content.includes('// [PROVIDERS]')) {
            const initialContent = closeTag
                ? `${openTag}\n      // [PROVIDERS]\n    ${closeTag}`
                : openTag;
            content = content.replace('// [PROVIDERS]', initialContent);
        } else {
            content = content.replace(
                /return \(([\s\S]*?)\)/,
                (match, inner) => {
                    return `return (\n    ${openTag}${inner.trim()}\n    ${closeTag}\n  )`;
                }
            );
        }
    }

    fs.writeFileSync(filePath, content);
}

export function finalizeAppFile(filePath: string) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf-8');

    content = content
        .replace(/\/\/ \[IMPORTS\]/g, '')
        .replace(/\/\/ \[PROVIDERS\]/g, '')
        .replace(/^\s*[\r\n]/gm, (match) => match.length > 2 ? '\n' : match);

    fs.writeFileSync(filePath, content.trim() + '\n');
}

export function patchViteConfig(filePath: string, importLine: string, pluginLine: string) {
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf-8');

    if (importLine && !content.includes(importLine)) {
        content = content.replace('// [IMPORTS]', `${importLine}\n// [IMPORTS]`);
    }

    if (pluginLine && !content.includes(pluginLine)) {
        content = content.replace('// [PLUGINS]', `${pluginLine},\n    // [PLUGINS]`);
    }

    fs.writeFileSync(filePath, content);
}

export function finalizeViteConfig(filePath: string) {
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf-8');

    content = content
        .replace(/\/\/ \[IMPORTS\]/g, '')
        .replace(/\/\/ \[PLUGINS\]/g, '')
        .replace(/\n\s*\n\s*\n/g, '\n\n');

    fs.writeFileSync(filePath, content.trim() + '\n');
}