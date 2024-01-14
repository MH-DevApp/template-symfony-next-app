import {z} from "zod";

export const UserModel = z.object({
    email: z.string(),
    password: z.string().optional(),
    roles: z.array(z.string()).optional(),
    createdAt: z.string()
});

export type UserType = z.infer<typeof UserModel>;