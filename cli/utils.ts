import fs from 'fs-extra';

export function copyTemplate(src: string, path: string) {
    if (!fs.existsSync(src)) {
        console.warn(`⚠️ Template folder ${src} doesn't exist`);
        return;
    }
    fs.copySync(src, path, { overwrite: true });
}

export function patchFileContent(filePath: string, searchValue: string, replaceValue: string) {
    if (!fs.existsSync(filePath)) return;
    const content = fs.readFileSync(filePath, 'utf-8');
    const newContent = content.replace(searchValue, replaceValue);
    fs.writeFileSync(filePath, newContent);
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

export function patchPackageJsonFile(filePath: string, projectName: string) {
    if (!fs.existsSync(filePath)) return;

    try {
        const pkg = fs.readJsonSync(filePath);
        pkg.name = projectName;
        fs.writeJsonSync(filePath, pkg, { spaces: 2 });
    } catch (error) {
        console.error('⚠️ Could not update package.json name');
    }
}

export function patchViteConfig(filePath: string, beforeReactPlugin: boolean, importLine: string, pluginLine: string) {
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf-8');

    if (importLine && !content.includes(importLine)) {
        content = content.replace('// [IMPORTS]', `${importLine}\n// [IMPORTS]`);
    }

    if (beforeReactPlugin) {
        if (pluginLine && !content.includes(pluginLine)) {
            content = content.replace('// [BEFORE_REACT_PLUGINS]', `${pluginLine},\n    // [BEFORE_REACT_PLUGINS]`);
        }
    } else {
        if (pluginLine && !content.includes(pluginLine)) {
            content = content.replace('// [AFTER_REACT_PLUGINS]', `${pluginLine},\n    // [AFTER_REACT_PLUGINS]`);
        }
    }

    fs.writeFileSync(filePath, content);
}

export function finalizeViteConfig(filePath: string) {
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf-8');

    content = content
        // Briše marker i sav prazan prostor (redove) oko njega
        .replace(/\s*\/\/ \[IMPORTS\]\s*/g, '\n')
        .replace(/\s*\/\/ \[AFTER_REACT_PLUGINS\]\s*/g, '\n')
        .replace(/\s*\/\/ \[BEFORE_REACT_PLUGINS\]\s*/g, '\n')
        // Sređuje višestruke prazne redove u jedan
        .replace(/\n{3,}/g, '\n\n')
        .trim();

    fs.writeFileSync(filePath, content + '\n');
}

export function finalizeAppFile(filePath: string) {
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf-8');

    content = content
        .replace(/\s*\/\/ \[IMPORTS\]\s*/g, '\n')
        .replace(/\s*\/\/ \[PROVIDERS\]\s*/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

    fs.writeFileSync(filePath, content + '\n');
}

export function detectPackageManager() {
    const userAgent = process.env.npm_config_user_agent || '';

    if (userAgent.includes('pnpm')) return 'pnpm';
    if (userAgent.includes('yarn')) return 'yarn';

    return 'npm';
}