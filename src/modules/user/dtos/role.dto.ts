export interface FindRoleDto {
    id?: string;
    name?: string;
}

export interface CreateRoleDto {
    name: string;
    description?: string;
}

export interface UpdateRoleDto {
    id: string;
    name: string;
    description?: string;
}

export interface DeleteRoleDto {
    id: string;
}
