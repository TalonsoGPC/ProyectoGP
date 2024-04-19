import {Component} from "@angular/core";
import { NavController, NavParams} from 'ionic-angular';

import {DatosAPP} from "../../services/datosApp";
import { ListaRecepciones } from "../listaRecepciones/listaRecepciones";

@Component({
    selector: "menuControlGP-page",
    templateUrl: "menuControlGP.html"
})

export class menuControlGP{

    listaMenu: any[] = [];
    db: string;
    DatosUsuario: DatosAPP;

    constructor(private navCtlr: NavController, private navparams: NavParams){
        
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.db = this.DatosUsuario.db;

        this.listaMenu.push({
            id: 1,
            nombre: "Recepciones",
            logo: "almacen.png"
        }//, 
        //{id: 2,
        //nombre: "Requisiciones",
        //logo: "compras.png"}
        );

    }
   
    onMenu(param: number){
        if(param==1){
            
            this.navCtlr.push(ListaRecepciones, {DatosUsuario: this.DatosUsuario});
        }
   }

}