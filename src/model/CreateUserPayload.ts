import type {UserModel} from "./UserModel.ts";

export interface CreateUserPayload extends Omit<UserModel, "id" | "createdAt" | "updatedAt">{
    password: string
    isAdmin: boolean
}