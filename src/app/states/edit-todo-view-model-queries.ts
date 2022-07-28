import { Selector } from "@ngxs/store";
import { ITodo } from "../models/ITodo";
import { AuthState, IPermission, Permissions } from "./auth.state";
import { TodoState } from "./todo.states";

export interface IEditTodoViewModel {
    selectedTodo: ITodo;
    activePermission: IPermission | undefined;
    userCanEdit: boolean;
}

export class EditTodoViewModelQueries {

    @Selector([
        AuthState.getPermissions,
        TodoState.getSelectedTodo
    ])
    static getViewModel(
        permissions: IPermission[],
        selectedTodo: ITodo
    ): IEditTodoViewModel {

        // Permission example
        // {
        //     userIds: [1,2,3,4],
        //     permissionType: Permissions.ADMIN
        // }

        // selectedtodo example
        // {
        //     ...,
        //     id: 2
        // }

        // Check which of the permissions has a userIds array that matches the id for the selected todo
        // the method return the whole permission if it found it        
        const permission = permissions.find(permission => permission.userIds.includes(selectedTodo.id));
        return {
            selectedTodo: selectedTodo,
            activePermission: permission,
            userCanEdit: permission?.permissionType === Permissions.ADMIN || permission?.permissionType === Permissions.EDITOR
        }
    }

}