import { installers } from './mapper.js';
import { axiosInstaller } from './packages.js';
import { Answers } from './types.js';

export function collectDependencies(answers: Answers, packageManager: string) {
    const dependency = new Set<string>();
    const devDependency = new Set<string>();
    const cmd: string[] = [];

    const dlx = packageManager === 'npm' ? 'npx --yes' : `${packageManager} dlx --yes`;

    // Default base packages
    axiosInstaller.dependency?.forEach(d => dependency.add(d));

    // Packages from answers
    Object.entries(answers).forEach(([key, value]) => {
        if (Array.isArray(value)) return;
        const installer = installers[value === true ? key : value];

        installer?.dependency?.forEach(d => dependency.add(d));
        installer?.devDependency?.forEach(d => devDependency.add(d));
    })

    if (answers.shadcn && answers.style === 'tailwind') {
        cmd.push(`${dlx} shadcn@latest init -d`);

        if (answers.shadcnComponents && answers.shadcnComponents.length > 0) {
            const componentsStr = answers.shadcnComponents.join(' ');
            cmd.push(`${dlx} shadcn@latest add ${componentsStr} -y -o`);
        }
    }

    return {
        dependency: Array.from(dependency),
        devDependency: Array.from(devDependency),
        cmd
    };
}