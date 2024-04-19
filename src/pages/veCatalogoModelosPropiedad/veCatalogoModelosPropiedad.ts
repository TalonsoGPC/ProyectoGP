import { Component } from "@angular/core";
import { ConstructorService } from "../../services/serviciosConstructor";
import { VePropiedad } from "../../services/vePropiedad";
import { NavController, NavParams, ActionSheetController, AlertController, } from "ionic-angular";
import { VeCatalogoModelosPropiedadDetallePage } from "../veCatalogoModelosPropiedadDetalle/veCatalogoModelosPropiedadDetalle";
import { Proyectos } from "../../services/proyectos";
import { MenuBossPage  } from "../menuBoss/menuBoss";
import { DatosAPP } from "../../services/datosApp";
        

@Component({
    selector: "veCatalogoModelosPropiedad-page",
    templateUrl: "veCatalogoModelosPropiedad.html"
})

export class VeCatalogoModelosPropiedadPage{
    listaProyectos: Proyectos[];
    listaModelos: VePropiedad[];
    
    db: string;
    tituloFiltro: string;
    DatosUsuario: DatosAPP;

    constructor(private navCtlr: NavController, private servicio: ConstructorService, private navparams: NavParams,
    private actionSheet: ActionSheetController, private alertController: AlertController){
        
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.db = this.DatosUsuario.db;
        this.cargarProyectos();
        this.cargarModelos();

    }

    ionViewWillEnter() {
        this.cargarProyectos();
        this.cargarModelos();
    }

    cargarProyectos(){
        this.servicio.getDatos("proyectos/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaProyectos = rs;
        }, (er)=>{
            console.log(er);
        });
        
    }

    cargarModelos(){
        this.servicio.getDatos("vePropiedad/proyecto/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaModelos = rs;
        },err=>console.log(err))
    }

    
   nuevoModelo(){
        this.navCtlr.push(VeCatalogoModelosPropiedadDetallePage, {DatosUsuario: this.DatosUsuario});
    }

    verModelo(modelo){
        this.navCtlr.push(VeCatalogoModelosPropiedadDetallePage, {
            modelo: modelo,
            DatosUsuario: this.DatosUsuario
        });
    }

    irBoss(){
        this.navCtlr.push(MenuBossPage, {DatosUsuario: this.DatosUsuario});
    }

      getFiltro(){
           let hojaFiltro = this.actionSheet.create({
                    title: "Filtros",
                    buttons: [{
                        text: "Proyectos",
                        handler: ()=>{
                            this.tituloFiltro = "Filtro: Proyecto";
                            this.verOpcionFiltro(1);
                        }
                    },
                    {
                        text: "Todo",
                        handler: ()=>{
                          this.tituloFiltro = "";
                          this.cargarModelos();
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

            this.tituloFiltro = "Filtro: Proyecto";
            peticion = "vePropiedad/proyecto/"+this.db+"/";
            alert.setTitle("Proyectos");

            this.listaProyectos.forEach(element => {
                alert.addInput({
                    type: "radio",
                    label: element.nombre,
                    value: element.numproy.toString()
                });
            });    
        }
        alert.addButton("Cancelar");
        alert.addButton({
            text: "OK",
            handler: data => {
                let id = parseInt(data);
                peticion+=id.toString()+"/";
                this.servicio.getDatos(peticion, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
                    rs => this.listaModelos = rs,
                    er=>console.log(er)
                );

                this.servicio.getDatos("proyectos/numproy/"+this.db+"/"+id.toString()+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
                    rs => this.tituloFiltro = rs[0].nombre,
                    er=>console.log(er)
                );
            }
        })

        alert.present();
    }
}