import { compare, hash } from "bcryptjs";

export const hashPassword = async (password: string) => {
    return await hash(password, 10);
}

export const checkPassword = async (password: string, comparandum: string) => {
    return await compare(password, comparandum);
}