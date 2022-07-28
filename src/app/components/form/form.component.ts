import { Component, OnInit } from '@angular/core';
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
import { ITodo } from '../../models/ITodo';
 

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  @Select(TodoState.getSelectedTodo) selectedTodo:
    | Observable<ITodo>
    | undefined;

  todoForm!: FormGroup;
  editTodo: boolean = false ;
  private formSubscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.formSubscription.add(
      this.selectedTodo?.subscribe(todo => {
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
      })
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
      this.formSubscription.add(
        this.store.dispatch(new UpdateTodo(this.todoForm?.value, this.todoForm?.value.id)).subscribe(()=>{
          this.clearForm();
        })
      )
    }else{
        this.formSubscription.add(
          this.formSubscription = this.store.dispatch(new AddTodo(this.todoForm?.value)).subscribe(() => {
            this.clearForm();
          })
      )
    }
  }

  clearForm(){
    this.todoForm?.reset()
    this.store.dispatch( new SetSelectedTodo(null as any))
  }

}
