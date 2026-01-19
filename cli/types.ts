export type StyleOption = 'tailwind' | 'css';
export type RouterOption = 'react-router' | 'tanstack-router';
export type IconOption = 'react-icons' | 'font-awesome' | 'phosphor-icons';
export type ToastOption = 'react-hot-toast' | 'react-toastify' | 'sonner';
export type FormOption = 'react-hook-form' | 'tanstack-form';
export type SchemaOption = 'zod' | 'yup';
export type GlobalStateOption = 'zustand';
export type ShadcnComponents = 'button' | 'input' | 'card' | 'dialog' | 'sheet' | 'dropdown-menu' | 'table' | 'checkbox' | 'avatar' | 'badge';

export interface PackageInstaller {
    dependency?: string[];
    devDependency?: string[];
    cmd?: string[];
}

export interface Answers {
    projectName: string;
    style: StyleOption;
    router: RouterOption;
    reactQuery: boolean;
    shadcn: boolean;
    shadcnComponents?: ShadcnComponents[];
    icons: IconOption;
    toast: ToastOption;
    form: FormOption
    schema: SchemaOption;
    globalState: GlobalStateOption;
}