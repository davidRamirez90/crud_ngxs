import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { DeleteTodo, GetTodos, SetSelectedTodo } from 'src/app/actions/todo.action';
import { ITodo } from 'src/app/models/ITodo';
import { TodoState } from 'src/app/states/todo.states';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @Select(TodoState.getTodoList) todos?: Observable<ITodo[]>

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new GetTodos());
  }

  deleteTodo(id:number){
    this.store.dispatch(new DeleteTodo(id));
  }

  editTodo(patload:ITodo){
    this.store.dispatch(new SetSelectedTodo(patload));
  }

}
