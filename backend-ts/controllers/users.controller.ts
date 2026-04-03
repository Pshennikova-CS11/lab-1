import { NextFunction, Request, Response } from "express";
import { CreateUserDto, PatchUserDto, UserResponseDto } from "../dtos/users.dto";
import { usersService } from "../services/users.service";
import { ApiItemResponse, ApiListResponse } from "../types/api";
import { UserListQuery } from "../types/user";

export function getUsers(
    req: Request<{}, ApiListResponse<UserResponseDto>, never, UserListQuery>,
    res: Response<ApiListResponse<UserResponseDto>>,
    next: NextFunction
): void {
    try {
        const result = usersService.getAll(req.query);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export function getUserById(
    req: Request<{ id: string }, ApiItemResponse<UserResponseDto>>,
    res: Response<ApiItemResponse<UserResponseDto>>,
    next: NextFunction
): void {
    try {
        const result = usersService.getById(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export function createUser(
    req: Request<{}, ApiItemResponse<UserResponseDto>, CreateUserDto>,
    res: Response<ApiItemResponse<UserResponseDto>>,
    next: NextFunction
): void {
    try {
        const result = usersService.create(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}

export function patchUser(
    req: Request<{ id: string }, ApiItemResponse<UserResponseDto>, PatchUserDto>,
    res: Response<ApiItemResponse<UserResponseDto>>,
    next: NextFunction
): void {
    try {
        const result = usersService.patch(req.params.id, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export function deleteUser(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): void {
    try {
        usersService.softDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}