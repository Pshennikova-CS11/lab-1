import { NextFunction, Request, Response } from "express";
import { CreateUserDto, UpdateUserDto, UserResponseDto } from "../dtos/users.dto";
import { usersService } from "../services/users.service";
import { ApiItemResponse, ApiListResponse } from "../types/api";
import { UserListQuery } from "../types/user";

export async function getUsers(
    req: Request<{}, ApiListResponse<UserResponseDto>, never, UserListQuery>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const result = await usersService.getAll(req.query);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function getUserById(
    req: Request<{ id: string }, ApiItemResponse<UserResponseDto>>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const result = await usersService.getById(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function createUser(
    req: Request<{}, ApiItemResponse<UserResponseDto>, CreateUserDto>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const result = await usersService.create(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}

export async function patchUser(
    req: Request<{ id: string }, ApiItemResponse<UserResponseDto>, UpdateUserDto>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const result = await usersService.patch(req.params.id, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function deleteUser(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        await usersService.softDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}