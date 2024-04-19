import { Component } from "@angular/core";
import { ConstructorService } from "../../services/serviciosConstructor";
import { Empresas } from "../../services/empresas";
import { NavController, NavParams, ActionSheetController, AlertController, } from "ionic-angular";
import { CatalogoEmpresasDetallePage } from "../catalogoEmpresasDetalle/catalogoEmpresasDetalle";
import { TiposEmpresa } from "../../services/tiposempresa";
import { MenuBossPage  } from "../menuBoss/menuBoss";
import { DatosAPP } from "../../services/datosApp";
        

@Component({
    selector: "catalogoEmpresas-page",
    templateUrl: "catalogoEmpresas.html"
})

export class CatalogoEmpresasPage{
    listaTiposEmpresa: TiposEmpresa[];
    listaEmpresas: Empresas[];
    db: string;
    DatosUsuario: DatosAPP;

    constructor(private navCtlr: NavController, private servicio: ConstructorService, private navparams: NavParams,
    private actionSheet: ActionSheetController, private alertController: AlertController, ){
            this.DatosUsuario = this.navparams.get("DatosUsuario");
            this.db = this.DatosUsuario.db;
            this.cargarTiposEmpresas();
            this.cargarEmpresas();

    }

    ionViewWillEnter() {
         this.cargarEmpresas();
    }

    cargarTiposEmpresas(){
        this.servicio.getDatos("tiposempresa/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaTiposEmpresa = rs;
        }, (er)=>{
            console.log(er);
        });
        
    }

    cargarEmpresas(){
        this.servicio.getDatos("empresas/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaEmpresas = rs;
        },err=>console.log(err))
    }
    

    modificarTarea(tarea){
        this.navCtlr.push(CatalogoEmpresasDetallePage,{
            tarea:tarea,
            DatosUsuario: this.DatosUsuario
        });
    }

    
   nuevaEmpresa(){
        this.navCtlr.push(CatalogoEmpresasDetallePage,{DatosUsuario: this.DatosUsuario});
    }

    verEmpresa(empresa){
        this.navCtlr.push(CatalogoEmpresasDetallePage, {
            empresa: empresa,
            DatosUsuario: this.DatosUsuario
        });
    }

    irBoss(){
        this.navCtlr.push(MenuBossPage,{DatosUsuario: this.DatosUsuario});
    }


  getFiltro(){
            let hojaFiltro = this.actionSheet.create({
                    title: "Filtros",
                    buttons: [
                    { 
                        text: "Tipo",
                        handler: ()=>{
                                this.verOpcionFiltro(1);
                        }
                    },
                    {
                        text: "Todo",
                        handler: ()=>{
                            this.cargarEmpresas();
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
        
        if(param==1){
            peticion = "empresas/tipo/"+this.db+"/";
            alert.setTitle("Tipo");
            this.listaTiposEmpresa.forEach(element => {
                    alert.addInput({
                    type: "radio",
                    label: element.descripcion,
                    value: element.tipo.toString()
                });
                
            })
        }

        alert.addButton("Cancelar");
        alert.addButton({
            text: "OK",
            handler: data=> {
                let id = parseInt(data);
                
                this.servicio.getDatos(peticion+id.toString()+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
                    rs => this.listaEmpresas = rs,
                    er=>console.log(er)
                );
            }
        })

        alert.present();
    }

}