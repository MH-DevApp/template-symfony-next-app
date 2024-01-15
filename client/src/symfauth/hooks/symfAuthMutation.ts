import {ErrorFieldType} from "@/utils/fetchUtil";
import {useMutation} from "@tanstack/react-query";
import {z} from "zod";
import {SignUpFormSchema} from "@/symfauth/components/forms/SignUpForm";
import {signIn, signUp} from "@/symfauth/SymfAuth";
import {SignInFormSchema} from "@/symfauth/components/forms/SignInForm";
import {UserModel, UserType} from "@/models/User";

type MutationSignInProps = {
    successHandler: (user: UserType) => void;
    errorHandler: (errors: ErrorFieldType[]) => void;
}

type MutationSignUpProps = {
    successHandler: () => void;
    errorHandler: (errors: ErrorFieldType[]) => void;
}

export const useSignUpMutation = ({successHandler, errorHandler}: MutationSignUpProps) => {
    return useMutation({
        mutationFn: async (values: z.infer<typeof SignUpFormSchema>) => {
            return await signUp({
                email: values.email.toString(),
                password: values.password.toString()
            });
        },
        onSuccess: async (response) => {
            if (!response.success) {
                errorHandler(response.errors ?? []);
                return;
            }

            successHandler();
        },
        onError: (error: Error) => {
            errorHandler([{field: "root", message: error.message}]);
        }
    })
}

export const useSignInMutation = ({successHandler, errorHandler}: MutationSignInProps) => {
    return useMutation({
        mutationFn: async (values: z.infer<typeof SignInFormSchema>) => {
            return await signIn({
                email: values.email.toString(),
                password: values.password.toString()
            });
        },
        onSuccess: async (response) => {
            if (!response.success) {
                errorHandler(response.errors ?? []);
                return;
            }

            try {
                const user: UserType = UserModel.parse(response.data.user);
                successHandler(user);
            } catch (error) {
                throw new Error("There are errors in the response of the server. Please try again later. If the problem persists, contact the administrator");
            }
        },
        onError: (error: Error) => {
            errorHandler([{field: "root", message: error.message}]);
        }
    })
}