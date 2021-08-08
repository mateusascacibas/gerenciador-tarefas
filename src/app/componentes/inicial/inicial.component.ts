import { Component, OnInit } from '@angular/core';
import { VirtualTimeScheduler } from 'rxjs';
import { Tarefa } from 'src/app/models/tarefa.model';
import { TarefaService } from 'src/app/servicos/tarefa.service';
import { Ordernacao } from 'src/app/utils/ordernacao.enum';

@Component({
  selector: 'app-inicial',
  templateUrl: './inicial.component.html',
  styleUrls: ['./inicial.component.css']
})
export class InicialComponent implements OnInit {

  tarefas: Tarefa[] = [];
  constructor(private tarefaService: TarefaService) { }
  tarefa: Tarefa = new Tarefa('','', false);
  ordem: Ordernacao = Ordernacao.ASC;
  filtro: string = '';
  pagina: number = 0;
  currentPage: number = 0;
  
  paginar($event: any, pagina: number){
    $event.preventDefault();
    this.pagina = pagina;
    this.currentPage = pagina;
    this.carregarTarefas();
  }

  numeroPaginas() {
    return this.tarefaService.numeroPaginas(this.filtro);
  }

  obterPaginas() {
    return [...Array(this.numeroPaginas()).keys()];
  }

  ordenar(){ 
    if(this.ordem === Ordernacao.ASC){
      this.ordem = Ordernacao.DESC;
    }
    else{
      this.ordem = Ordernacao.ASC;
    }
    this.carregarTarefas();  
  }

  ascendente(){
    return this.ordem === Ordernacao.ASC;
  }

  pesquisar($event: any){
    this.pagina = 0;
    this.filtro = $event.target.value;
    this.carregarTarefas();  
  }

  ngOnInit(): void {
    this.carregarTarefas();  
  }

  concluir(id: string) {
    this.tarefaService.concluir(id);
    this.carregarTarefas();  
  }

  armazena(tarefaId: string){
    this.tarefa = this.tarefaService.listarId(tarefaId)
  }

  remover() {
      this.pagina = 0;
      this.tarefaService.remover(this.tarefa.id);
      this.carregarTarefas();  
  }

  private carregarTarefas(){
    this.tarefas = this.tarefaService.listarPaginado(this.ordem, this.filtro, this.pagina);
  }
}
