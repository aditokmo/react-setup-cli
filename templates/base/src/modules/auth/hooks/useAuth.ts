import { useState } from "react";
import { getAPIErrorMessage } from "@/utils/api-error-handler";
import { AuthService } from "../services";

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (data: any) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await AuthService.login(data);
            return res;
        } catch (err) {
            const errorMessage = getAPIErrorMessage(err);
            setError(errorMessage);
            console.error(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: any) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await AuthService.register(data);
            return res;
        } catch (err) {
            const errorMessage = getAPIErrorMessage(err);
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await AuthService.logout();
        } catch (err) {
            console.error(getAPIErrorMessage(err));
        }
    };

    return {
        login,
        register,
        logout,
        isLoading,
        error
    };
};