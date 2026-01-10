export type StyleOption = 'tailwind' | 'css' | 'none';
export type RouterOption = 'react-router' | 'tanstack-router';

export interface Answers {
    projectName: string;
    style: StyleOption;
    router: RouterOption;
    reactQuery: boolean;
    shadcn: boolean;
}