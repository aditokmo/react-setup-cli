#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { askQuestions } from './questions.js';
import { copyTemplate, patchViteConfig, finalizeViteConfig, patchAppFile, finalizeAppFile, detectPackageManager } from './utils.js';
import { collectDependencies } from './installers.js';
import { Answers } from './types.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        const viteConfigPath = path.join(projectDir, 'vite.config.ts');

        fs.ensureDirSync(projectDir);

        copyTemplate(
            path.join(templateRoot, 'base'),
            projectDir
        );

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

        process.chdir(projectDir);

        console.log(`📦 Initializing ${packageManager} project...`);
        execSync(`${packageManager} install`, { stdio: 'inherit' });

        if (dependency.length) {
            console.log('📦 Installing dependencies...');
            execSync(`${packageManager} ${installAction} ${dependency.join(' ')}`, { stdio: 'inherit' });
        }

        if (devDependency.length) {
            console.log('📦 Installing dev dependencies...');
            execSync(`${packageManager} ${installAction} -D ${devDependency.join(' ')}`, { stdio: 'inherit' });
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