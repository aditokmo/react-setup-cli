import { getAPIErrorMessage } from "@/utils/api-error-handler";
import { AuthService } from "../services"
import { useMutation } from '@tanstack/react-query';

export const useAuth = () => {
    const login = useMutation({
        mutationFn: AuthService.login,
        onSuccess: (res) => {
            // Handle mutation success
        },
        onError: (error) => {
            const errorMessage = getAPIErrorMessage(error);
            console.error(errorMessage)
            // Display error message to user
        },
    });

    const register = useMutation({
        mutationFn: AuthService.register,
        onSuccess: (res) => {
            // Handle mutation success
        },
        onError: (error) => {
            const errorMessage = getAPIErrorMessage(error);
            console.error(errorMessage)
            // Display error message to user
        },
    });

    const logout = useMutation({
        mutationFn: AuthService.logout,
        onSuccess: (res) => {
            // Handle mutation success
        },
        onError: (error) => {
            const errorMessage = getAPIErrorMessage(error);
            console.error(errorMessage)
            // Display error message to user
        },
    });

    return { login, register, logout }
}