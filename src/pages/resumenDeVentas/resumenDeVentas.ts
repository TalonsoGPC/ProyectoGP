import { Component } from "@angular/core";
import { Proyectos }  from '../../services/proyectos';
import { ConstructorService }  from '../../services/serviciosConstructor';
import {FormBuilder, FormGroup } from "@angular/forms";
import { ActionSheetController, AlertController, NavParams} from "ionic-angular";
import { VeVendedores }  from '../../services/veVendedores';
import { DatosAPP } from "../../services/datosApp";


@Component({
    selector: "resumenDeVentas-page",
    templateUrl: "resumenDeVentas.html"
})

export class ResumenDeVentasPage{
    colorLabel =  "#488aff";
    listaProyectos: Proyectos[];
    listaVendedores: VeVendedores[];
    proyectoSeleccionado: number;
    form: FormGroup;
    listaResumen: any[]=[];
    totalPropiedades: number;
    titulo: string;
    tituloPie: string;
    vendedorSeleccionado: number;
    parametro: number;
    tituloResumenVentas: string;
    db: string;
    DatosUsuario: DatosAPP
    constructor(private fb: FormBuilder, private servicio: ConstructorService, private actionSheet: ActionSheetController, private alertController: AlertController,
                public navparams: NavParams){
        
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.db = this.DatosUsuario.db;
        this.tituloResumenVentas = "Resumen de Ventas";
        this.parametro = 0;
        this.parametro = this.navparams.get("parametro");

        if(this.parametro == 1){
             this.tituloResumenVentas = "Resumen de Ventas";
        }else if(this.parametro == 2){
             this.tituloResumenVentas = "Resumen Inmuebles";
        }


        this.proyectoSeleccionado = 0;
        this.totalPropiedades = 0;
        this.vendedorSeleccionado = 0;
        this.titulo =  "  TOTAL EXPEDIENTES";
        this.tituloPie = "";
        this.cargarForma();
        this.cargarProyectos();
        this.cargarVendedores();
        this.cargarResumen();

    }

    cargarProyectos(){
        this.servicio.getDatos("proyectos/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaProyectos = rs;
        }, er=>console.log(er));
    }

    cargarVendedores(){
        this.servicio.getDatos("veVendedores/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaVendedores= rs;
        }, er=>console.log(er));
    }

    cargarForma(){
            this.form = this.fb.group({
            numproy: [this.proyectoSeleccionado]
        });
    }
    
    cargarResumen(){
        let peticion = "resumenDeVentasProyecto/";


        if(this.proyectoSeleccionado != 0){

            if(this.parametro==1){
                peticion = "resumenDeVentasProyectoRango/"+this.db+"/"+this.proyectoSeleccionado.toString()+"/where a.id>=1 and a.id<=10/";
            }else if(this.parametro==2){
                peticion = "resumenDeVentasProyectoRango/"+this.db+"/"+this.proyectoSeleccionado.toString()+"/where a.id>=12 and a.id<=16/"
            }else{
                peticion = "resumenDeVentasProyecto/"+this.db+"/"+this.proyectoSeleccionado.toString()+"/";
            }

            this.servicio.getDatos(peticion, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
                        this.listaResumen = rs;
                        this.totalPropiedades = 0;
                        this.listaResumen.forEach((element)=>{
                            this.totalPropiedades += element.cantidad;
                        })
        }, er=>console.log(er))
    }else if(this.vendedorSeleccionado != 0){
        
            if(this.parametro==1){
                peticion = "resumenDeVentasVendedorRango/"+this.db+"/"+this.vendedorSeleccionado.toString()+"/where a.id>=1 and a.id<=10/";
            }else if(this.parametro==2){
                peticion = "resumenDeVentasVendedorRango/"+this.db+"/"+this.vendedorSeleccionado.toString()+"/where a.id>=12 and a.id<=16/"
            }else{
                peticion = "resumenDeVentasVendedor/"+this.db+"/"+this.vendedorSeleccionado.toString()+"/";
            }


            this.servicio.getDatos(peticion, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
                        this.listaResumen = rs;
                        this.totalPropiedades = 0;
                        this.listaResumen.forEach((element)=>{
                            this.totalPropiedades += element.cantidad;
                        })
        }, er=>console.log(er))

    }else{
                    
            if(this.parametro==1){
                peticion = "resumenDeVentasTodoRango/"+this.db+"/where a.id>=1 and a.id<=10/";
            }else if(this.parametro==2){
                peticion = "resumenDeVentasTodoRango/"+this.db+"/where a.id>=12 and a.id<=16/";
            }else{
                peticion = "resumenDeVentasTodo/"+this.db;
            }


            this.servicio.getDatos(peticion, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaResumen = rs;
            this.totalPropiedades = 0;
            this.listaResumen.forEach((element)=>{
                this.totalPropiedades += element.cantidad;
            })
        }, er=>console.log(er))
        }
       
    }

    seleccionarProyecto(proyecto){
        this.proyectoSeleccionado = proyecto;
        this.cargarResumen();
    }

    getFiltro(){
                let hojaFiltro = this.actionSheet.create({
                    title: "Filtros",
                    buttons: [{
                        text: "Proyectos",
                        handler: ()=>{
                            this.vendedorSeleccionado = 0;
                            this.verOpcionFiltro(1);
                        }
                    },
                    {
                        text: "Vendedor",
                        handler: ()=>{
                            this.proyectoSeleccionado = 0;
                            this.verOpcionFiltro(2);
                        }
                    },
                    {
                        text: "Todo",
                        handler: ()=>{
                            this.titulo = "  TOTAL EXPEDIENTES";
                            this.tituloPie = "";
                            this.proyectoSeleccionado = 0;
                            this.vendedorSeleccionado = 0;
                            this.cargarResumen();
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
        let alert = this.alertController.create();
        
        if(param==1){
            this.tituloPie = "Filtro: Proyecto";
            alert.setTitle("Proyectos");

            this.listaProyectos.forEach(element => {
                alert.addInput({
                    type: "radio",
                    label: element.nombre,
                    value: element.numproy.toString()
                });
            });    
        }else  if(param==2){
            this.tituloPie = "Filtro: Vendedores";
            alert.setTitle("Vendedores");

            this.listaVendedores.forEach(element => {
                alert.addInput({
                    type: "radio",
                    label: element.nombre,
                    value: element.id.toString()
                });
            });    
        }

        alert.addButton("Cancelar");
        alert.addButton({
            text: "OK",
            handler: data=> {
                let id = parseInt(data);
                
                if(param==1){
                    this.proyectoSeleccionado = id;
                    for (var key in this.listaProyectos) {
                        if(this.listaProyectos[key].numproy == id ){
                            this.titulo = this.listaProyectos[key].nombre;
                            break; 
                        }
                    }
                }else if(param==2){
                    this.vendedorSeleccionado = id;
                    for (var key2 in this.listaVendedores) {
                        if(this.listaVendedores[key2].id == id ){
                            this.titulo = this.listaVendedores[key2].nombre;
                            break; 
                        }
                    }
                }

                this.cargarResumen();

                

            }
        })

        alert.present();
    }

}