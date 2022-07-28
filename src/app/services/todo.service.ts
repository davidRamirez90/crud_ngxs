import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ITodo } from '../models/ITodo';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  constructor(private http: HttpClient) {}

  fetchTodos() {
    return this.http.get<ITodo[]>('https://jsonplaceholder.typicode.com/todos');
  }

  deleteTodo(id: number) {
    return this.http.delete('https://jsonplaceholder.typicode.com/todos/' + id);
  }

  addTodo(payload: ITodo) {
    return this.http.post<ITodo>(
      'https://jsonplaceholder.typicode.com/todos',
      payload
    );
  }

  updateTodo(payload: ITodo, id: number) {
    return this.http.put<ITodo>(
      'https://jsonplaceholder.typicode.com/todos/' + id,
      payload
    );
  }
}
