import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tarefa } from 'src/app/models/tarefa.model';
import { TarefaService } from 'src/app/servicos/tarefa.service';
import { cssValidacaoForm } from 'src/app/utils/css.util';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.css']
})
export class CadastrarComponent implements OnInit {

  constructor(private fb: FormBuilder, private tarefaService: TarefaService) { }

  @ViewChild('nomeInput', { static: true })
  nomeInput!: ElementRef<HTMLInputElement>;

  form: FormGroup = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(5)]]
  });


  ngOnInit(): void {
  }

  cssValidacao(campo: string) {
    return cssValidacaoForm(this.form.controls[campo]);
  }

  cadastrar() {
    if (this.form.invalid) {
      alert("Erro ao cadastrar.");
      return;
    }
    else {
      const tarefa: Tarefa = this.form.value;
      this.tarefaService.adicionar(tarefa);
      this.form.reset();
      this.nomeInput.nativeElement.focus();
    }
  }

}
