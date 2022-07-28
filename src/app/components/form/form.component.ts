import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoState } from '../../states/todo.states';
import {
  AddTodo,
  SetSelectedTodo,
  UpdateTodo,
} from '../../actions/todo.action';
import { Observable, Subscription } from 'rxjs';
import { EditTodoViewModelQueries, IEditTodoViewModel } from 'src/app/states/edit-todo-view-model-queries';
import { filter, map } from 'rxjs/operators';
 

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit, OnDestroy {
  // We replaced this selector for our own custom view model, check 2 lines down
  // @Select(TodoState.getSelectedTodo) selectedTodo:
  //   | Observable<ITodo>
  //   | undefined;

  @Select(EditTodoViewModelQueries.getViewModel) formModel$: Observable<IEditTodoViewModel> | undefined;

  todoForm!: FormGroup;
  editTodo: boolean = false ;

  // Array which will contain all created subscriptions, so we can unsubscribe from all of them
  // in a single place when the component gets destroyed
  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {
    this.createForm();
  }

  ngOnDestroy(): void {
    // Subscription garbage collection trick to avoid memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

  ngOnInit() {
    this.subscriptions.push(
      this.formModel$?.pipe(
          filter(model => !!model), // filter whenever model is null or undef.
          map(model => model.selectedTodo)
        )
        .subscribe(todo => {
          if (todo) {
            this.todoForm?.patchValue({
              id: todo.id,
              userId: todo.userId,
              title: todo.title
            });
            this.editTodo = true;
          } else {
            this.editTodo = false;
          }
        }) as Subscription
    );
}

  createForm(){
    this.todoForm = this.fb.group({
      id:[''],
      userId: ['', Validators.required],
      title: ['', Validators.required]
    })
  }

  onSubmit(){
    if(this.editTodo){
      this.store.dispatch(new UpdateTodo(this.todoForm?.value, this.todoForm?.value.id)).subscribe(()=>{
        this.clearForm();
      })
    }else{
      this.store.dispatch(new AddTodo(this.todoForm?.value)).subscribe(() => {
        this.clearForm();
      })
    }
  }

  clearForm(){
    this.todoForm?.reset()
    this.store.dispatch( new SetSelectedTodo(null as any))
  }

}
