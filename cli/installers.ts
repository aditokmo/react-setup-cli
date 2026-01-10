import { reactQueryInstaller, reactRouterInstaller, shadcnInstaller, tailwindInstaller } from './packages';
import { Answers } from './types';

export function collectDependencies(answers: Answers) {
    const dependency = new Set<string>();
    const devDependency = new Set<string>();
    const cmd: string[] = [];

    if (answers.style === 'tailwind') {
        tailwindInstaller.dependency.forEach(d => dependency.add(d));
        tailwindInstaller.devDependency?.forEach(d => devDependency.add(d));
    }

    if (answers.reactQuery) {
        reactQueryInstaller.dependency.forEach(d => dependency.add(d));
        reactQueryInstaller.devDependency.forEach(d => devDependency.add(d));
    }

    if (answers.router === 'react-router') {
        reactRouterInstaller.dependency.forEach(d => dependency.add(d));
        reactRouterInstaller.devDependency?.forEach(d => devDependency.add(d));
    }

    if (answers.shadcn && answers.style === 'tailwind') {
        cmd.push(...shadcnInstaller.cmd);
    }

    return {
        dependency: Array.from(dependency),
        devDependency: Array.from(devDependency),
        cmd
    };
}
