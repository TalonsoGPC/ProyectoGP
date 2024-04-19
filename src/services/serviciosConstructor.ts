import { Injectable } from '@angular/core';
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";

import "rxjs/add/operator/map";
import "rxjs/add/operator/first";
import "rxjs/add/operator/catch";
import 'rxjs/add/observable/throw';

@Injectable()
export class ConstructorService {
  private headers = new Headers({"Content-Type":"application/json"});
  private url = "http://gpconstruct.elitesystemsmexico.net:8000/";

  constructor(private http: Http) { 
  }

 valDocto(id: number, proyecto:number, tema:number, peticion: string, direccion: string, puerto: string): Observable<any[]>{
    
    if (puerto.length<=0){
       puerto = "";
    }else{
      puerto = ":"+puerto;
    }

    if (direccion.indexOf("http")  >= 0) {
      this.url = direccion+puerto+"/";
    }else{
      this.url = "http://"+direccion+puerto+"/";
    }

  
    if(direccion == null ||  direccion == ""){
      this.url = "http://gpconstruct.elitesystemsmexico.net:8000//";
    }
    
    let url = this.url + peticion + id+"/"+proyecto+"/"+tema+"/";

    return this.http.get(url)
    .first()
    .map(r=>r.json())
    .catch(this.handleError)
  }

  getDatos(peticion: string, direccion: string, puerto: string): Observable<any[]>{
    
      if (puerto.length<=0){
          puerto = "";
      }else{
        puerto = ":"+puerto;
      }

      if (direccion.indexOf("http")  >= 0) {
        this.url = direccion+puerto+"/";
      }else{
        this.url = "http://"+direccion+puerto+"/";
      }

      if(direccion == null ||  direccion == ""){
        this.url = "http://gpconstruct.elitesystemsmexico.net:8000/";
      }
      
      let url = this.url + peticion;//`${this.url}`;
    
      return this.http.get(url).map(r=>r.json()).catch(this.handleError);
  }



  filtroMensajes(id: number, peticion: string, direccion: string, puerto: string): Observable<any[]>{
      
    
      if (puerto.length<=0){
          puerto = "";
      }else{
        puerto = ":"+puerto;
      }

      if (direccion.indexOf("http")  >= 0) {
        this.url = direccion+puerto+"/";
      }else{
        this.url = "http://"+direccion+puerto+"/";
      }

      if(direccion == null ||  direccion == ""){
        this.url = "http://gpconstruct.elitesystemsmexico.net:8000/";
      }

     let url = this.url + peticion + id.toString();
     return this.http.get(url).map(r=>r.json()).catch(this.handleError);
  }

  filtroMensajes2(tema:number, id: number, filtro: number, peticion: string, direccion: string, puerto: string): Observable<any[]>{
      
    
      if (puerto.length<=0){
          puerto = "";
      }else{
        puerto = ":"+puerto;
      }

      if (direccion.indexOf("http")  >= 0) {
        this.url = direccion+puerto+"/";
      }else{
        this.url = "http://"+direccion+puerto+"/";
      }

     if(direccion == null ||  direccion == ""){
      this.url = "http://gpconstruct.elitesystemsmexico.net:8000/";
     }



     let url = this.url + peticion + tema.toString()+"/"+id.toString()+"/"+filtro.toString()+"/";

     return this.http.get(url).map(r=>r.json()).catch(this.handleError);
  }

  addRegistro(peticion: string, objeto: any, direccion: string, puerto: string){

    
      if (puerto.length<=0){
          puerto = "";
      }else{
        puerto = ":"+puerto;
      }

      if (direccion.indexOf("http")  >= 0) {
        this.url = direccion+puerto+"/";
      }else{
        this.url = "http://"+direccion+puerto+"/";
      }

      if(direccion == null ||  direccion == ""){
        this.url = "http://gpconstruct.elitesystemsmexico.net:8000/";
      }

      let url = this.url + peticion;
      let iJSON = JSON.stringify(objeto);
      return this.http.post(url, iJSON, {headers: this.headers})
      .map(r=>r.json())
      .catch(this.handleError)
  }

  putRegistro(peticion: string, objeto: any, direccion: string, puerto: string){

    
      if (puerto.length<=0){
          puerto = "";
      }else{
        puerto = ":"+puerto;
      }

      if (direccion.indexOf("http")  >= 0) {
        this.url = direccion+puerto+"/";
      }else{
        this.url = "http://"+direccion+puerto+"/";
      }

      if(direccion == null ||  direccion == ""){
        this.url = "http://gpconstruct.elitesystemsmexico.net:8000/";
      }

      let url = this.url + peticion;
      let iJSON = JSON.stringify(objeto);    
      return this.http.put(url, iJSON, {headers: this.headers})
      .map(r=>r.json())
      .catch(this.handleError)
  }

  delRegistro(id: number, peticion: string, direccion: string, puerto: string){

    
      if (puerto.length<=0){
          puerto = "";
      }else{
        puerto = ":"+puerto;
      }

      if (direccion.indexOf("http")  >= 0) {
        this.url = direccion+puerto+"/";
      }else{
        this.url = "http://"+direccion+puerto+"/";
      }

      if(direccion == null ||  direccion == ""){
        this.url = "http://gpconstruct.elitesystemsmexico.net:8000/";
      }

      let url = this.url + peticion + id.toString();
      return this.http.delete(url)
      .map(r=>r.json())
      .catch(this.handleError)
  }
  
  private handleError(error: Response | any){
    let errMsg: string;
    if(error instanceof Response){
      let body = error.json() || '';
      let err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    }else{
      errMsg = error.message ? error.message: error.toString();
    }

    return Observable.throw(errMsg);
  }
}















