import { group, text, select, confirm, isCancel, cancel, multiselect } from '@clack/prompts';
import { Answers, FormOption, GlobalStateOption, IconOption, RouterOption, SchemaOption, ShadcnComponents, StyleOption, ToastOption } from './types.js';

export async function askQuestions(): Promise<Answers> {
    const results = await group(
        {
            projectName: () => text({
                message: 'Project name:',
                placeholder: 'my-app',
                validate: (value) => (value.length < 0 ? 'Project name is required' : undefined),
            }),

            style: () => select<StyleOption>({
                message: 'Choose styling:',
                options: [
                    { value: 'tailwind', label: 'Tailwind' },
                    { value: 'css', label: 'CSS' },
                ],
            }),

            shadcn: ({ results }) => {
                if (results.style !== 'tailwind') return Promise.resolve(false);
                return confirm({ message: 'Include Shadcn UI?' });
            },

            shadcnComponents: ({ results }) => {
                if (!results.shadcn) return Promise.resolve([]);

                return multiselect({
                    message: 'Use space to select shadcn/ui components to install:',
                    options: [
                        { value: 'button', label: 'Button' },
                        { value: 'input', label: 'Input' },
                        { value: 'card', label: 'Card' },
                        { value: 'dialog', label: 'Dialog' },
                        { value: 'sheet', label: 'Sheet' },
                        { value: 'dropdown-menu', label: 'Dropdown Menu' },
                        { value: 'table', label: 'Table' },
                        { value: 'checkbox', label: 'Checkbox' },
                        { value: 'avatar', label: 'Avatar' },
                        { value: 'badge', label: 'Badge' },
                    ],
                    required: false,
                });
            },

            icons: () => select<IconOption>({
                message: 'Choose icon library:',
                options: [
                    { value: 'react-icons', label: 'React Icons' },
                    { value: 'font-awesome', label: 'Font Awesome' },
                    { value: 'phosphor-icons', label: 'Phosphor Icons' }
                ]
            }),

            toast: () => select<ToastOption>({
                message: 'Choose toast library:',
                options: [
                    { value: 'react-hot-toast', label: 'React Hot Toast' },
                    { value: 'react-toastify', label: 'React Toastify' },
                    { value: 'sonner', label: 'Sonner' },
                ]
            }),

            router: () => select<RouterOption>({
                message: 'Choose router:',
                options: [
                    { value: 'react-router', label: 'React Router' },
                    { value: 'tanstack-router', label: 'Tanstack Router' },
                ],
            }),

            form: () => select<FormOption>({
                message: 'Choose form library:',
                options: [
                    { value: 'react-hook-form', label: 'React Hook Form' },
                    { value: 'tanstack-form', label: 'TanStack Form' },
                ],
            }),

            schema: () => select<SchemaOption>({
                message: 'Choose schema library:',
                options: [
                    { value: 'zod', label: 'Zod' },
                    { value: 'yup', label: 'Yup' },
                ]
            }),

            globalState: () => select<GlobalStateOption>({
                message: 'Choose global state management library:',
                options: [
                    { value: 'zustand', label: 'Zustand' },
                ]
            }),

            reactQuery: () => confirm({ message: 'Include React Query?' }),
        },
        {
            onCancel: () => {
                cancel('Operation cancelled.');
                process.exit(0);
            },
        }
    );

    if (isCancel(results.projectName) ||
        isCancel(results.style) ||
        isCancel(results.router) ||
        isCancel(results.shadcn) ||
        isCancel(results.shadcnComponents) ||
        isCancel(results.icons) ||
        isCancel(results.toast) ||
        isCancel(results.reactQuery)
    ) {
        cancel('Setup cancelled.');
        process.exit(0);
    }

    return {
        ...results,
        shadcn: results.shadcn as boolean,
        shadcnComponents: (results.shadcnComponents ?? []) as ShadcnComponents[],
    };
}