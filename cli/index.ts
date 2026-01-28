#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { askQuestions } from './questions.js';
import { copyTemplate, patchViteConfig, finalizeViteConfig, patchAppFile, finalizeAppFile, detectPackageManager, patchPackageJsonFile, patchFileContent } from './utils.js';
import { collectDependencies } from './installers.js';
import { Answers } from './types.js';
import { fileURLToPath } from 'url';
import { FONT_QUERIES } from './mapper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseDeps = ['react', 'react-dom'];

const baseDevDeps = [
    'vite',
    'typescript',
    '@types/node',
    '@types/react',
    '@types/react-dom',
    '@vitejs/plugin-react-swc',
    'eslint',
    '@eslint/js',
    'eslint-plugin-react-hooks',
    'eslint-plugin-react-refresh',
    'globals',
    'typescript-eslint'
];

async function main() {
    console.log('⚛️ Welcome to React CLI Setup by github/aditokmo');

    let projectDir: string = '';
    const originalDirectory = process.cwd();

    try {
        const answers: Answers = await askQuestions();

        const packageManager = detectPackageManager();
        const installAction = packageManager === 'yarn' ? 'add' : 'install';

        projectDir = path.join(process.cwd(), answers.projectName);
        const templateRoot = path.join(__dirname, '../templates');
        const appFilePath = path.join(projectDir, 'src', 'App.tsx');
        const indexHTMLPath = path.join(projectDir, 'index.html');
        const notFoundPath = path.join(projectDir, 'src/modules/common/pages/NotFound.tsx');
        const viteConfigPath = path.join(projectDir, 'vite.config.ts');

        fs.ensureDirSync(projectDir);

        copyTemplate(
            path.join(templateRoot, 'base'),
            projectDir
        );

        patchPackageJsonFile(path.join(projectDir, 'package.json'), answers.projectName);

        // Styles
        if (answers.style === 'tailwind') {
            copyTemplate(
                path.join(templateRoot, 'styles', 'tailwind', 'src'),
                path.join(projectDir, 'src/styles')
            );

            patchViteConfig(
                viteConfigPath,
                false,
                'import tailwindcss from "@tailwindcss/vite"',
                'tailwindcss()'
            );
        }

        if (answers.style === 'css') {
            copyTemplate(
                path.join(templateRoot, 'styles', 'css', 'src'),
                path.join(projectDir, 'src/styles')
            );
        }

        if (answers.style === 'scss') {
            copyTemplate(
                path.join(templateRoot, 'styles', 'scss', 'src'),
                path.join(projectDir, 'src/styles')
            );


            patchFileContent(notFoundPath, "import '@/styles/404.css'", "import '@/styles/404.scss'");

            patchFileContent(indexHTMLPath, '<link rel="stylesheet" href="./src/styles/main.css" />', '<link rel="stylesheet" href="./src/styles/main.scss" />');
        }

        // Fonts
        if (answers?.fonts && answers.fonts.length > 0) {
            const fontString = answers.fonts
                .map(name => FONT_QUERIES[name])
                .join('&');

            const url = `https://fonts.googleapis.com/css2?${fontString}&display=swap`;

            const content = `
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="${url}" rel="stylesheet">`;

            patchFileContent(indexHTMLPath, '<!-- [HEAD_LINK_IMPORT] -->', content);
        } else {
            patchFileContent(indexHTMLPath, '<!-- [HEAD_LINK_IMPORT] -->', '');
        }

        // State Management
        if (answers.reactQuery) {
            copyTemplate(
                path.join(templateRoot, 'state', 'react-query', 'src', 'provider'),
                path.join(projectDir, 'src/providers')
            );

            copyTemplate(
                path.join(templateRoot, 'state', 'react-query', 'src', 'hook'),
                path.join(projectDir, 'src/modules/auth/hooks')
            );

            patchAppFile(
                appFilePath,
                "import { ReactQueryProvider } from './providers'",
                "<ReactQueryProvider>",
                "</ReactQueryProvider>"
            );
        }

        if (answers.globalState === 'zustand') {
            copyTemplate(
                path.join(templateRoot, 'state', 'zustand', 'src'),
                path.join(projectDir, 'src/store')
            )
        }

        // Router
        if (answers.router === 'react-router') {
            copyTemplate(
                path.join(templateRoot, 'router', 'react-router', 'src', 'routes'),
                path.join(projectDir, 'src/routes')
            );

            copyTemplate(
                path.join(templateRoot, 'router', 'react-router', 'src', 'components'),
                path.join(projectDir, 'src/components')
            );

            copyTemplate(
                path.join(templateRoot, 'router', 'react-router', 'src', 'modules', 'auth', 'routes'),
                path.join(projectDir, 'src/modules/auth/routes')
            );

            patchAppFile(
                appFilePath,
                "import { BrowserRouter } from 'react-router'\nimport { AppRoutes } from './routes'",
                "<BrowserRouter>\n      <AppRoutes />",
                "</BrowserRouter>"
            );
        } else if (answers.router === 'tanstack-router') {
            copyTemplate(
                path.join(templateRoot, 'router', 'tanstack-router', 'src', 'routes'),
                path.join(projectDir, 'src/routes')
            )

            copyTemplate(
                path.join(templateRoot, 'router', 'tanstack-router', 'src', 'providers'),
                path.join(projectDir, 'src/providers')
            )

            patchAppFile(
                appFilePath,
                "import { TanStackRouterProvider } from './providers/TanstackRouterProvider'",
                "<TanStackRouterProvider />",
                ""
            );

            patchViteConfig(
                viteConfigPath,
                true,
                "import { tanstackRouter } from '@tanstack/router-plugin/vite'",
                "tanstackRouter({ target: 'react', autoCodeSplitting: true })"
            )
        }

        finalizeAppFile(appFilePath);
        finalizeViteConfig(viteConfigPath);

        const { dependency, devDependency, cmd } = collectDependencies(answers, packageManager);

        const allDeps = [...baseDeps, ...dependency];
        const allDevDeps = [...baseDevDeps, ...devDependency];

        process.chdir(projectDir);

        console.log(`📦 Initializing ${packageManager} project...`);
        execSync(`${packageManager} install`, { stdio: 'inherit' });

        if (allDeps.length) {
            console.log('📦 Installing dependencies...');
            execSync(`${packageManager} ${installAction} ${allDeps.join(' ')}`, { stdio: 'inherit' });
        }

        if (allDevDeps.length) {
            console.log('📦 Installing dev dependencies...');
            execSync(`${packageManager} ${installAction} -D ${allDevDeps.join(' ')}`, { stdio: 'inherit' });
        }
        
        // Extra cmds like shadcn
        for (const command of cmd) {
            console.log(`⚙️ Running: ${command}`);
            execSync(command, { stdio: 'inherit' });
        }

        console.log('✅ Project setup completed');
        console.log(`👉 cd ${answers.projectName} && ${packageManager} run dev`);
    } catch (error: any) {
        console.error('\n❌ Error while creating a project:');
        console.error(`👉 ${error.message}`);

        process.chdir(originalDirectory);

        if (projectDir && fs.existsSync(projectDir)) {
            console.log('🧹 Cleaning... Deleting failed project installation.');
            fs.removeSync(projectDir);
        }

        process.exit(1);
    }
}

main();