import { Injectable } from '@angular/core';
import { Tarefa } from '../models/tarefa.model';
import { Ordernacao } from '../utils/ordernacao.enum';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {
  
  private readonly total_elem_pag = 3;
  
  constructor() {
    
  }

  concluir(id: string) {
    const tarefas = this.listarTodos();
    for (let task of tarefas) {
      if (task.id == id) {
        task.concluido = !task.concluido;
      }
    }
    this.persistir(tarefas);
  }
  
  listarTodos(): Tarefa[] {
    return JSON.parse(localStorage['tarefas'] || '[]');
  }

  listarPaginado(ordem = Ordernacao.ASC, filtro = "", pagina = 0): Tarefa[] {
     let tarefa = JSON.parse(localStorage['tarefas'] || '[]');
     //Filtro
     tarefa = this.filtrar(tarefa, filtro);
     //Ordernação
     if(ordem === Ordernacao.ASC){
      tarefa.sort((t1: Tarefa, t2: Tarefa) => t1.nome.localeCompare(t2.nome));

      } else{
        tarefa.sort((t1: Tarefa, t2: Tarefa) => t2.nome.localeCompare(t1.nome));
     }
     //Paginação
     const indice = pagina * this.total_elem_pag;
     tarefa = tarefa.slice(indice,indice + this.total_elem_pag);
     return tarefa;
  }

  adicionar(tarefa: Tarefa) {
    tarefa.id = new Date().getTime().toString();
    tarefa.concluido = false;
    const tarefas = this.listarTodos();
    tarefas.push(tarefa);
    this.persistir(tarefas);
  }

  remover(id: String){
    const tarefas = this.listarTodos().filter(tarefa => tarefa.id !== id);
    this.persistir(tarefas);
  }

  listarId(id: string): Tarefa {
    const tarefa = this.listarTodos().find(tarefa => tarefa.id === id);
    if (!tarefa) {
      return new Tarefa('', '', false);
    }
    return tarefa;
    
  }

  editar(tarefa: Tarefa) {
    const tarefas = this.listarTodos().map(t => {
      if (tarefa.id === t.id) {
        t.nome = tarefa.nome;
      }
      return t;
    });
    this.persistir(tarefas);
  }

  numeroPaginas(filtro: string){
    const tarefas = this.filtrar(this.listarTodos(), filtro);
    return Math.ceil(tarefas.length / this.total_elem_pag);
  }

  private filtrar(tarefas: Tarefa[], filtro: string): Tarefa[] {
    if (filtro === '') {
      return tarefas;
    }
    return tarefas.filter((tarefa: Tarefa) =>
        tarefa.nome.toLowerCase().startsWith(filtro.toLowerCase()));
  }

  private persistir(tarefas: Tarefa[]){
    localStorage['tarefas'] = JSON.stringify(tarefas);
  }
}
