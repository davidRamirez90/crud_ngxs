import { Injectable } from "@angular/core";
import { Selector, State } from "@ngxs/store";

export interface IPermission {
    userIds: number[];
    permissionType: Permissions;
}

export class AuthStateModel {
    permissions: IPermission[] | undefined;
}

const defaultPermissions: IPermission[] = [
    {
        userIds: [1,2,3,4],
        permissionType: Permissions.ADMIN
    },
    {
        userIds: [5,6,7,9],
        permissionType: Permissions.EDITOR
    },
    {
        userIds: [8, 10],
        permissionType: Permissions.USER
    }
]

export const enum Permissions {
    ADMIN = 0,
    EDITOR,
    USER
}

@State<AuthStateModel>({
    name:'auth',
    defaults:{
        permissions: defaultPermissions
    }
})

@Injectable()
export class AuthState {

    @Selector()
    static getPermissions(state: AuthStateModel) {
        return state.permissions;
    }

}