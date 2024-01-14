import {ErrorFieldType} from "@/utils/fetchUtil";
import {useMutation} from "@tanstack/react-query";
import {z} from "zod";
import {SignUpFormSchema} from "@/symfauth/components/forms/SignUpForm";
import {signUp} from "@/symfauth/SymfAuth";

type MutationProps = {
    successHandler: () => void;
    errorHandler: (errors: ErrorFieldType[]) => void;
}

export const useSignUpMutation = ({successHandler, errorHandler}: MutationProps) => {
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