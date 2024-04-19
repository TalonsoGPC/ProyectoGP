import { Component } from "@angular/core";
import { ConstructorService } from "../../services/serviciosConstructor";
import { Tareas } from "../../services/tareas";
import { NavController, NavParams, ActionSheetController, AlertController, } from "ionic-angular";
import { CatalogoTareasDetallePage } from "../catalogoTareasDetalle/catalogoTareasDetalle";
import { Temas } from "../../services/temas";
import { MenuBossPage  } from "../menuBoss/menuBoss";
import { DatosAPP } from "../../services/datosApp";

@Component({
    selector: "catalogoTareas-page",
    templateUrl: "catalogoTareas.html"
})

export class CatalogoTareasPage{
    listaTemas: Temas[];
    listaTareas: Tareas[];
    listaTask: any[]=[];
    tema: any;
    filtroTema: number;
    db: string;
    DatosUsuario: DatosAPP;

    constructor(private navCtlr: NavController, private servicio: ConstructorService, private navparams: NavParams,
                private actionSheet: ActionSheetController, private alertController: AlertController, ){
                    
            this.DatosUsuario = this.navparams.get("DatosUsuario");
            this.db = this.DatosUsuario.db;
                    
            this.filtroTema = 0;
            this.cargarTemas();
            this.cargarTareas();
            


    }

    ionViewWillEnter() {
         this.cargarTareas();
    }

    cargarTareas(){
        if(this.filtroTema == 0){
            this.servicio.getDatos("tareas/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaTareas = rs;
            }, (er)=>{
                console.log(er);
            });
        }else{
                this.servicio.filtroMensajes(this.filtroTema, "tareas/tema/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
                    rs => this.listaTareas = rs,
                    er=>console.log(er)
                );
        }
       
        
    }

    cargarTemas(){
        this.servicio.getDatos("temas/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaTemas = rs;
        },err=>console.log(err))
    }
    

    modificarTarea(tarea){
        this.navCtlr.push(CatalogoTareasDetallePage,{
            tarea:tarea,
            DatosUsuario: this.DatosUsuario
        });
    }

    getFiltro(){
            let hojaFiltro = this.actionSheet.create({
                    title: "Filtros",
                    buttons: [
                    { 
                        text: "Temas",
                        handler: ()=>{
                                this.verOpcionFiltro(2);
                        }
                    },
                    {
                        text: "Todo",
                        handler: ()=>{
                            this.filtroTema = 0
                            this.cargarTareas();
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

    verOpcionFiltro(param: number){
        
        let peticion;
        let alert = this.alertController.create();
        
        if(param==2){
            peticion = "tareas/tema/"+this.db+"/";
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
        }

        alert.addButton("Cancelar");
        alert.addButton({
            text: "OK",
            handler: data=> {
                let id = parseInt(data);
                this.filtroTema = id;
                this.servicio.filtroMensajes(id, peticion, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
                    rs => this.listaTareas = rs,
                    er=>console.log(er)
                );
            }
        })

        alert.present();
    }

   nuevaTarea(){
        this.navCtlr.push(CatalogoTareasDetallePage, {DatosUsuario: this.DatosUsuario});
    }

    verTarea(tarea){
        this.navCtlr.push(CatalogoTareasDetallePage, {
            tarea: tarea, 
            DatosUsuario: this.DatosUsuario
        });
    }

    habilitarTarea(object, tarea: Tareas){
        if(tarea.ocultar == null || tarea.ocultar == 1){
            tarea.ocultar = 0;
            
        }else{
            tarea.ocultar = 1;
        }

        this.servicio.putRegistro("tareas/"+this.db+"/", tarea, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            //console.log(rs)
        }, (er)=>console.log(er));
    }

    ofOcultarTarea(tema: number){
        var retorno = true;
      
        for (var index = 0; index < this.listaTemas.length; index++) {
            if(this.listaTemas[index].id==tema && this.listaTemas[index].ocultar==0){
                retorno = false;
                break;
            }
        }

        return retorno;

    }

      irBoss(){
        this.navCtlr.push(MenuBossPage, {DatosUsuario: this.DatosUsuario});
    }

}