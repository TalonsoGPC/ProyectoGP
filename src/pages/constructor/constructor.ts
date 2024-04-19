import {  Component } from "@angular/core"
import { NavController, ActionSheetController, AlertController, NavParams } from "ionic-angular";
import { Usuarios }  from '../../services/usuarios';
import { AutBossPage } from "../autBoss/autBoss";
import { AlertasPage } from "../alertas/alertas";

import { ConstructorService }  from '../../services/serviciosConstructor';
import { RequisicionesPage } from "../requisiciones/requisiciones";
import { MensajesUsuario } from "../../services/mensajesusuario";
import { Proyectos }  from '../../services/proyectos';
import { Temas }  from '../../services/temas';
import { Estatus }  from '../../services/estatus';
import { Tareas }  from '../../services/tareas';
import { MenuBossPage } from "../menuBoss/menuBoss";
import { TiposReportesBossPage } from "../tiposReportesBoss/tiposReportesBoss";
import { DocumentosProyectosPage } from "../documentosProyectos/documentosProyectos";
import { ReportesProyectosPage }  from "../reportesProyectos/reportesProyectos";
import { DatosAPP } from "../../services/datosApp";
import {NotificacionesPage} from "../notificaciones/notificaciones";

@Component({
    selector: "constructor-page",
    templateUrl: "constructor.html"
})

export class ConstructorPage{
   tema: number;
   titulo: string;
   listaTemas: Temas[];
   listaTareas: Tareas[];
   listaProyectos: Proyectos[];
   listaEstatus: Estatus[];
   listaUsuarios: Usuarios[];
   tituloConstructor: string;
   mensaje: MensajesUsuario;
   listaMensajesPorTema: any[]=[];
   db: string;
   asset: string
   DatosUsuario: DatosAPP;

    constructor(public navCtlr: NavController, private servicio: ConstructorService, 
    private actionSheet: ActionSheetController, private alertController: AlertController,
    private navparams: NavParams){

        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.db = this.DatosUsuario.db;
        this.asset = this.DatosUsuario.asset;

        this.tema = this.navparams.get("tema");
        this.tituloConstructor = "Proyectos";

        this.cargarMensajesOptimizadoUsuario();
        this.cargarTemas();
        this.cargarEstatus();
        this.cargarProyectosUsuario();

       
    }

    ionViewWillEnter() {
         this.cargarMensajesOptimizadoUsuario();
    }
    cargarTareas(){
         this.servicio.getDatos("tareas/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
        .subscribe(  
            rs=>this.listaTareas = rs,          
            er => console.log(er)
        )
    }
    navTema(objeto: any){
        var temaId = 0;
        if(this.tema == 0){
            temaId = objeto.tema;
        }else{
            temaId = this.tema;
        }

        this.navCtlr.push(RequisicionesPage, {
            mensaje: objeto,
            estatus: 1,
            tema: temaId,
            DatosUsuario: this.DatosUsuario
        });
    }

    generarNuevo(){
        this.navCtlr.push(RequisicionesPage, {
                estatus: 0,
                tema: this.tema,
                mensaje: null,
                DatosUsuario: this.DatosUsuario
            });
    }
    

    cargarProyectos(){
        this.servicio.getDatos("proyectos/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
        .subscribe(  
            rs=>this.listaProyectos = rs,          
            er => console.log(er)
        )
    }

    cargarProyectosUsuario(){
        this.servicio.getDatos("proyectosUsuario/"+this.db+"/"+this.DatosUsuario.usuario+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
        .subscribe(  
            rs=>this.listaProyectos = rs,          
            er => console.log(er)
        )
    }

    cargarTemas(){
        this.servicio.getDatos("temas/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
        .subscribe(  
            rs=>{
                this.listaTemas = rs;
                this.listaTemas.forEach((element)=>{
                    if(this.tema == element.id){
                        this.tituloConstructor = element.nombre;
                    }
                })
            },          
            er => console.log(er)
        )
    }

    cargarEstatus(){
        this.servicio.getDatos("estatus/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
        .subscribe(  
            rs=>this.listaEstatus = rs,          
            er => console.log(er)
        )
    }
    
    cargarUsuarios(){
        this.servicio.getDatos("usuarios/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
        .subscribe(  
            rs=>this.listaUsuarios = rs,          
            er => console.log(er)
        )
    }

    cargarMensajesOptimizado(){
        if(this.tema == 0){
                this.servicio.getDatos("mensajes/todo/temas/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
            .subscribe(  
            rs=>{
                this.listaMensajesPorTema = rs;
            },          
            er => console.log(er)
        )
        }else{
            this.servicio.getDatos("mensajes/portema/"+this.db+"/"+this.tema.toString()+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
            .subscribe(  
            rs=>{
                this.listaMensajesPorTema = rs;
            },          
            er => console.log(er)
        )
        }
    }

    cargarMensajesOptimizadoUsuario(){
        if(this.tema == 0){
                this.servicio.getDatos("mensajesUsuario/todo/temas/"+this.db+"/"+this.DatosUsuario.usuario+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
            .subscribe(  
            rs=>{
                this.listaMensajesPorTema = rs;
            },          
            er => console.log(er)
        )
        }else{
            this.servicio.getDatos("mensajesUsuario/portema/"+this.db+"/"+this.DatosUsuario.usuario+"/"+this.tema.toString()+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
            .subscribe(  
            rs=>{
                this.listaMensajesPorTema = rs;
            },          
            er => console.log(er)
        )
        }
    }

    getFiltro(){
                if(this.tema == 0){
                    let hojaFiltro = this.actionSheet.create({
                    title: "Filtros",
                    buttons: [{
                        text: "Proyectos",
                        handler: ()=>{
                            this.verOpcionFiltro(1);
                        }
                    },
                    { 
                        text: "Temas",
                        handler: ()=>{
                             this.verOpcionFiltro(2);
                        }
                    },
                    {
                        text: "Estatus",
                        handler: ()=>{
                            this.verOpcionFiltro(3);
                        }
                    },
                    {
                        text: "Todo",
                        handler: ()=>{
                            this.tituloConstructor = "Proyectos";
                            this.cargarMensajesOptimizadoUsuario();
                        }
                    },
                    {
                        text: "Cancelar",
                        role: "cancel"
                    }
                    ]
                });

                hojaFiltro.present();
        }else{
            let hojaFiltro = this.actionSheet.create({
                    title: "Filtros",
                    buttons: [{
                        text: "Proyectos",
                        handler: ()=>{
                                this.verOpcionFiltro2(1);
                        }
                    },
                    {
                        text: "Estatus",
                        handler: ()=>{
                            this.verOpcionFiltro2(2);
                        }
                    },
                    {
                        text: "Todo",
                        handler: ()=>{
                            this.tituloConstructor = "Proyectos";
                            this.filtroPorTema(this.tema);
                        }
                    },
                    {
                        text: "Cancelar",
                        role: "cancel"
                    }
                    ]
                });

                hojaFiltro.present();
        }
       
    }

    verOpcionFiltro(param: number){
        
        let peticion;
        let alert = this.alertController.create();
        
        if(param==1){
            this.tituloConstructor = "Filtro: Proyecto";
            peticion = "mensajesPorUsuario/proyecto/";
            alert.setTitle("Proyectos");

            this.listaProyectos.forEach(element => {
                alert.addInput({
                    type: "radio",
                    label: element.nombre,
                    value: element.numproy.toString()
                });
            });    
        }else if(param==2){
            this.tituloConstructor = "Filtro: Tema";
            peticion = "mensajesPorUsuario/tema/";
            alert.setTitle("Temas");
            this.listaTemas.forEach(element => {
                if(element.ocultar==1){
                    alert.addInput({
                    type: "radio",
                    label: element.nombre,
                    value: element.id.toString()
                });
                }
                
            })
        }else if(param==3){
            this.tituloConstructor = "Filtro: Estatus";
            peticion = "mensajesPorUsuario/estatus/";
            alert.setTitle("Estatus");
            this.listaEstatus.forEach(element=>{
                alert.addInput({
                    type: "radio",
                    label: element.nombre,
                    value: element.id.toString()
                });
            })
        }

        alert.addButton("Cancelar");
        alert.addButton({
            text: "OK",
            handler: data=> {
                let id = parseInt(data);
                this.servicio.getDatos(peticion+this.db+"/"+this.DatosUsuario.usuario+"/"+id+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
                    rs => this.listaMensajesPorTema = rs,
                    er=>console.log(er)
                );
            }
        })

        alert.present();
    }

     verOpcionFiltro2(param: number){
        
        let peticion;
        let alert = this.alertController.create();
        peticion = "mensajesUsuario/tema/";
        if(param==1){
            this.tituloConstructor = "Filtro: Proyecto";
            //this.cargarProyectos();
            alert.setTitle("Proyectos");

            this.listaProyectos.forEach(element => {
                alert.addInput({
                    type: "radio",
                    label: element.nombre,
                    value: element.numproy.toString()
                });
            });    
        }else if(param==2){
            //this.cargarEstatus();
            this.tituloConstructor = "Filtro: Estatus";
            alert.setTitle("Estatus");
            this.listaEstatus.forEach(element=>{
                alert.addInput({
                    type: "radio",
                    label: element.nombre,
                    value: element.id.toString()
                });
            })
        }

        alert.addButton("Cancelar");
        alert.addButton({
            text: "OK",
            handler: data=> {
                let id = parseInt(data);
                this.servicio.getDatos(peticion+this.db+"/"+this.DatosUsuario.usuario+"/"+this.tema.toString()+"/"+id.toString()+"/"+param.toString()+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
                    rs => this.listaMensajesPorTema = rs,
                    er=>console.log(er)
                );
            }
        })

        alert.present();
    }

    filtroPorTema(id: number){
        let peticion = "mensajesUsuario/portema/";
        this.servicio.getDatos(peticion+this.db+"/"+this.DatosUsuario.usuario+"/"+id.toString()+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
                    rs => this.listaMensajesPorTema = rs,
                    er=>console.log(er)
                );
    }

    verPorAut(){
         this.navCtlr.push(AutBossPage, {DatosUsuario: this.DatosUsuario});
    }

    verAlertas(){
        this.navCtlr.push(AlertasPage, {DatosUsuario: this.DatosUsuario});
    }

    OcultarPorModulo(item: MensajesUsuario){
        var retorno = true;

        this.listaTemas.forEach((element)=>{
            if(element.id==item.tema){
                if(element.ocultar == 1){
                    retorno = true;
                }else{
                    retorno = false;
                }
            }
        }); 

        return retorno;
    }

    menuControlObra(){
       this.navCtlr.push(MenuBossPage, {DatosUsuario: this.DatosUsuario}); 
    }

    irDocumentos(){
        this.navCtlr.push(DocumentosProyectosPage, {DatosUsuario: this.DatosUsuario});
    }

        
    irReportesBoss(){
        this.navCtlr.push(ReportesProyectosPage, {DatosUsuario: this.DatosUsuario});
    }

        
    returnPathFile(link, file){
            return this.DatosUsuario.url + this.asset+"/"+file;
    }

    irNotificaciones()
    {
        this.navCtlr.push(NotificacionesPage, {DatosUsuario: this.DatosUsuario});
    }
}