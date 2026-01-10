import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { askQuestions } from './questions';
import { copyTemplate, patchViteConfig, finalizeViteConfig, patchAppFile, finalizeAppFile } from './utils';
import { collectDependencies } from './installers';
import { Answers } from './types';

async function main() {
    console.log('⚛️ Welcome to React CLI by github/aditokmo');

    let projectDir: string = '';

    try {
        const answers: Answers = await askQuestions();

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
                'import tailwindcss from "@tailwindcss/vite"',
                'tailwindcss()'
            );
        } else if (answers.style === 'css') {
            copyTemplate(
                path.join(templateRoot, 'styles', 'css', 'src'),
                path.join(projectDir, 'src/styles')
            );
        }

        // State Management
        if (answers.reactQuery) {
            copyTemplate(
                path.join(templateRoot, 'state', 'react-query', 'src'),
                path.join(projectDir, 'src/providers')
            );

            patchAppFile(
                appFilePath,
                "import { ReactQueryProvider } from './providers'\n import { ReactQueryDevtools } from '@tanstack/react-query-devtools'",
                "<ReactQueryProvider>",
                "<ReactQueryDevtools initialIsOpen={false} />\n    </ReactQueryProvider>"
            );
        }

        // Router
        if (answers.router === 'react-router') {
            copyTemplate(
                path.join(templateRoot, 'router', 'react-router', 'src'),
                path.join(projectDir, 'src/routes')
            );

            patchAppFile(
                appFilePath,
                "import { BrowserRouter } from 'react-router'\nimport { AppRoutes } from './routes'",
                "<BrowserRouter>\n      <AppRoutes />",
                "</BrowserRouter>"
            );
        } else if (answers.router === 'tanstack-router') {
            // tanstack router
        }

        finalizeAppFile(appFilePath);
        finalizeViteConfig(viteConfigPath);

        const { dependency, devDependency, cmd } = collectDependencies(answers);

        process.chdir(projectDir);

        if (dependency.length) {
            console.log('📦 Installing dependencies...');
            execSync(`pnpm add ${dependency.join(' ')}`, { stdio: 'inherit' });
        }

        if (devDependency.length) {
            console.log('📦 Installing dev dependencies...');
            execSync(`pnpm add -D ${devDependency.join(' ')}`, { stdio: 'inherit' });
        }

        // Extra cmds like shadcn
        for (const command of cmd) {
            console.log(`⚙️ Running: ${command}`);
            execSync(command, { stdio: 'inherit' });
        }

        console.log('✅ Project setup completed');
        console.log(`👉 cd ${answers.projectName} && pnpm run dev`);
    } catch (error: any) {
        console.error('\n❌ Error while creating a project:');
        console.error(`👉 ${error.message}`);

        if (projectDir && fs.existsSync(projectDir)) {
            console.log('🧹 Cleaning... Deleting failed project installation.');
            fs.removeSync(projectDir);
        }

        process.exit(1);
    }
}

main();