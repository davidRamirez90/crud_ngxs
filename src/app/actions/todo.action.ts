import { ITodo } from '../models/ITodo'

export class AddTodo {
    static readonly type = '[Todo] Add';
    constructor(public payload: ITodo) {}

}

export class GetTodos { 
    static readonly type = '[Todo] Get';
}

export class UpdateTodo {
    static readonly type = '[Todo] Update';

    constructor(public payload: ITodo, public id : number) {}
}

export class DeleteTodo {
    static readonly type = '[Todo] Delete';
    constructor(public id: number) {}
}

export class SetSelectedTodo {
    static readonly type = '[Todo] Set'
    constructor(public payload: ITodo) {}
}