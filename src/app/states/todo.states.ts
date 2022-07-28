import { State, Action, StateContext, Selector, Actions } from '@ngxs/store';
import {patch, removeItem, updateItem} from '@ngxs/store/operators';
import { ITodo } from '../models/ITodo';
import {
  AddTodo,
  DeleteTodo,
  GetTodos,
  SetSelectedTodo,
  UpdateTodo,
} from '../actions/todo.action';
import { TodoService } from '../services/todo.service';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

export class TodoStateModel {
    todos: ITodo[] = [];
    selectedTodo!: ITodo ;
}

@State<TodoStateModel>({
    name:'todos',
    defaults:{
        todos: [],
        selectedTodo: null as any
    }
})

@Injectable()
export class TodoState {
    constructor(private todoService: TodoService){}

    @Selector()
    static getTodoList(state:TodoStateModel){
        return state.todos;
    }

    @Selector()
    static getSelectedTodo(state:TodoStateModel){
        return state.selectedTodo;
    }

    @Action(GetTodos)
    getTodos({getState, setState}:StateContext<TodoStateModel>){
        return this.todoService.fetchTodos().pipe( tap( (result)=>{
            const state = getState();
            setState({
                ...state,
                todos: result
            })
        }))
    }

    @Action(AddTodo)
    addTodo({getState, patchState}:StateContext<TodoStateModel>,{payload}:AddTodo){ // or ctx:StateContext<TodoStateModel> then cts.getState()
        return this.todoService.addTodo(payload).pipe( tap( (result)=>{
            const state = getState();
            patchState({
                todos: [...state.todos, result]  
          })
        }))
    }

    @Action(UpdateTodo)
    updateTodo({getState, setState}:StateContext<TodoStateModel>, {payload,id}:UpdateTodo){
        return this.todoService.updateTodo(payload, id).pipe( tap( (result)=>{
            // const state = getState();
            // const todoList = [...state.todos];
            // const todoIndex = todoList.findIndex(item => item.id === id);
            // todoList[todoIndex] = result;
            // setState({
            //     ...state,
            //     todos: todoList,
            // })

            // TODO: read documentation - https://www.ngxs.io/advanced/operators

            setState(
                patch({
                    todos: updateItem<ITodo>(todo => todo?.id === id, payload)
                })
            )
        }))
    }

    @Action(DeleteTodo)
    deleteTodo({getState, setState}:StateContext<TodoStateModel>, {id}:DeleteTodo){
        return this.todoService.deleteTodo(id).pipe( tap( ()=>{
            // const state = getState();
            // const filteredArr = state.todos.filter(item => item.id !== id);
            // setState({
            //     ...state,
            //     todos: filteredArr,
            // })

            setState(
                patch({
                    todos: removeItem<ITodo>(todo => todo?.id === id)
                })
            )
        })) 
    }

    @Action(SetSelectedTodo)
    setSelectedTodo({patchState}:StateContext<TodoStateModel>,{payload}: SetSelectedTodo) {
        patchState({
            selectedTodo: payload
        })
    }

}