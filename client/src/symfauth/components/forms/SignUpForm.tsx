"use client";

import {z} from "zod";
import {redirect, useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ErrorFieldType} from "@/utils/fetchUtil";
import {useSignUpMutation} from "@/symfauth/hooks/symfAuthMutation";
import {
    AlertCircle,
    ArrowRightCircle,
} from "lucide-react";
import {useSession} from "@/symfauth/session/SessionContext";
import {useLayoutEffect} from "react";

export const SignUpFormSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Email must be a valid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(20, "Password must be at most 20 characters")
        .regex(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[#@./+-])/,
            "Password must contain at least one minuscule, one majuscule, one number and one special char (#@./+-)"
        ),
    passwordConfirmation: z
        .string()
}).refine(data => data.password === data.passwordConfirmation, {
    message: "Password confirmation must be the same as password",
    path: ["passwordConfirmation"]
});

type fieldSignUpFormErrors = "email"|"password"|"root";

const SignUpForm = () => {
    const session = useSession();
    const router = useRouter();

    useLayoutEffect(() => {
        if (session.currentUser !== null) {
            redirect("/");
        }
    }, []);

    const {register, setError, handleSubmit, formState: {errors}} = useForm({
        resolver: zodResolver(SignUpFormSchema),
        defaultValues: {
            email: "",
            password: "",
            passwordConfirmation: "",
        }
    });

    const successHandler = () => {
        router.replace("/");
    }

    const errorHandler = (errors: ErrorFieldType[]) => {
        errors.forEach((error) => {
            setError(error.field as fieldSignUpFormErrors, {
                message: error.message
            });
        })
    }

    const mutation = useSignUpMutation({successHandler, errorHandler});

    return (
        <div className="flex flex-col gap-4 items-center justify-center w-full">
            <h1 className="text-2xl font-bold">Sign Up</h1>
            <form
                onSubmit={handleSubmit((values) => mutation.mutateAsync(values))}
                className="flex flex-col w-full max-w-md p-10 rounded-xl shadow-md shadow-gray-800 bg-gray-400/20"
            >
                <label className="block mb-2">
                    <span>Email</span>
                    <input
                        id="email"
                        type="email"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        {...register("email")}
                    />
                    {errors.email ?
                        <p className="flex flex-row gap-1 text-xs text-red-600 mt-2 italic">
                            <AlertCircle size={14} />
                            <span>{errors.email.message}</span>
                        </p> :
                        null
                    }
                </label>
                <label className="block mb-2">
                    <span>Password</span>
                    <input
                        id="password"
                        type="password"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        {...register("password")}
                    />
                    {errors.password ?
                        <p className="flex flex-row gap-1 text-xs text-red-600 mt-2 italic">
                            <AlertCircle size={14} />
                            <span>{errors.password.message}</span>
                        </p> :
                        null
                    }
                </label>
                <label className="block mb-2">
                    <span>Password Confirmation</span>
                    <input
                        id="passwordConfirmation"
                        type="password"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        {...register("passwordConfirmation")}
                    />
                    {errors.passwordConfirmation ?
                        <p className="flex flex-row gap-1 text-xs text-red-600 mt-2 italic">
                            <AlertCircle size={14} />
                            <span>{errors.passwordConfirmation.message}</span>
                        </p> :
                        null
                    }
                </label>
                <div className="flex justify-center mt-2">
                    <button
                        type="submit"
                        className="flex gap-2 bg-gray-600 hover:bg-gray-600/90 text-gray-100 font-bold py-2 px-4 rounded"
                    >
                        <span>Sign Up</span>
                        <ArrowRightCircle />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SignUpForm;