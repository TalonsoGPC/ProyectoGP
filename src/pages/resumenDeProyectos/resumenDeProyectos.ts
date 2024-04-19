import { Component } from "@angular/core";
import { Proyectos }  from '../../services/proyectos';
import { ConstructorService }  from '../../services/serviciosConstructor';
import {FormBuilder, FormGroup } from "@angular/forms";
import { ActionSheetController, AlertController, NavParams} from "ionic-angular";
import { Usuarios }  from '../../services/usuarios';
import { DatosAPP } from "../../services/datosApp";


@Component({
    selector: "resumenDeProyectos-page",
    templateUrl: "resumenDeProyectos.html"
})

export class ResumenDeProyectosPage{
    colorLabel =  "#488aff";
    listaProyectos: Proyectos[];
    listaUsuarios: Usuarios[];
    proyectoSeleccionado: number;
    form: FormGroup;
    listaResumen: any[]=[];
    totalProyectos: number;
    titulo: string;
    tituloPie: string;
    usuarioSeleccionado: number;
    tipoReporte: number;
    db: string;
    DatosUsuario: DatosAPP;

    constructor(private fb: FormBuilder, private servicio: ConstructorService, private actionSheet: ActionSheetController, 
                private alertController: AlertController, private navparams: NavParams){
        
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.db = this.DatosUsuario.db;

        this.tipoReporte = 1;

        this.proyectoSeleccionado = 0;
        this.totalProyectos = 0;
        this.usuarioSeleccionado = 0;
        
        this.cargarForma();
        this.cargarProyectos();
        this.cargarUsuarios();
        this.filtrosReportes();


        this.tituloPie = "";
    }

    cargarProyectos(){
        this.servicio.getDatos("proyectos/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaProyectos = rs;
        }, er=>console.log(er));
    }

    cargarUsuarios(){
        this.servicio.getDatos("usuarios/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaUsuarios= rs;
        }, er=>console.log(er));
    }

    cargarForma(){
            this.form = this.fb.group({
            numproy: [this.proyectoSeleccionado]
        });
    }
    
    cargarResumen(){
        if(this.proyectoSeleccionado != 0){
            this.servicio.getDatos("resumenDeProyectosProyecto/"+this.db+"/"+this.proyectoSeleccionado.toString()+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
                        this.listaResumen = rs;
                        this.totalProyectos = 0;
                        this.listaResumen.forEach((element)=>{
                            if(element.tarea==0){
                                this.totalProyectos += element.monto;
                            }
                                
                        })
        }, er=>console.log(er))
        }else if(this.usuarioSeleccionado != 0){
            this.servicio.getDatos("resumenDeProyectosUsuario/"+this.db+"/"+this.usuarioSeleccionado.toString()+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
                        this.listaResumen = rs;
                        this.totalProyectos = 0;
                        this.listaResumen.forEach((element)=>{
                              if(element.tarea==0){
                                this.totalProyectos += element.monto;
                                }
                        })
        }, er=>console.log(er))
        }else{
            this.servicio.getDatos("resumenDeProyectosTodo/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaResumen = rs;
            this.totalProyectos = 0;
            this.listaResumen.forEach((element)=>{
                  if(element.tarea==0){
                            this.totalProyectos += element.monto;
                    }
            })
        }, er=>console.log(er))
        }
       
    }

   cargarResumenTareas(){
        if(this.proyectoSeleccionado != 0){
            this.servicio.getDatos("resumenDeProyectosProyectoTareas/"+this.db+"/"+this.proyectoSeleccionado.toString()+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
                        this.listaResumen = rs;
                        this.totalProyectos = 0;
                        this.listaResumen.forEach((element)=>{
                            if(element.tarea==0){
                                this.totalProyectos += element.monto;
                            }
                                
                        })
        }, er=>console.log(er))
        }else if(this.usuarioSeleccionado != 0){
            this.servicio.getDatos("resumenDeProyectosUsuarioTareas/"+this.db+"/"+this.usuarioSeleccionado.toString()+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
                        this.listaResumen = rs;
                        this.totalProyectos = 0;
                        this.listaResumen.forEach((element)=>{
                              if(element.tarea==0){
                                this.totalProyectos += element.monto;
                                }
                        })
        }, er=>console.log(er))
        }else{
             this.servicio.getDatos("resumenDeProyectosTareasTodo/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaResumen = rs;
            this.totalProyectos = 0;
            this.listaResumen.forEach((element)=>{
                  if(element.tarea==0){
                            this.totalProyectos += element.monto;
                    }
            })
        }, er=>console.log(er))
        }
       
    }

   cargarResumenIngresos(){
        if(this.proyectoSeleccionado != 0){
            this.servicio.getDatos("resumenDeProyectosProyectoIngresos/"+this.db+"/"+this.proyectoSeleccionado.toString()+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
                        this.listaResumen = rs;
                        this.totalProyectos = 0;
                        this.listaResumen.forEach((element)=>{
                            if(element.tarea==0){
                                this.totalProyectos += element.monto;
                            }
                                
                        })
        }, er=>console.log(er))
        }else if(this.usuarioSeleccionado != 0){
            this.servicio.getDatos("resumenDeProyectosUsuarioIngresos/"+this.db+"/"+this.usuarioSeleccionado.toString()+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
                        this.listaResumen = rs;
                        this.totalProyectos = 0;
                        this.listaResumen.forEach((element)=>{
                              if(element.tarea==0){
                                this.totalProyectos += element.monto;
                                }
                        })
        }, er=>console.log(er))
        }else{
             this.servicio.getDatos("resumenDeProyectosIngresosTodo/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaResumen = rs;
            this.totalProyectos = 0;
            this.listaResumen.forEach((element)=>{
                  if(element.tarea==0){
                            this.totalProyectos += element.monto;
                    }
            })
        }, er=>console.log(er))
        }
       
    }

   cargarResumenPagos(){
        if(this.proyectoSeleccionado != 0){
            this.servicio.getDatos("resumenDeProyectosProyectoPagos/"+this.db+"/"+this.proyectoSeleccionado.toString()+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
                        this.listaResumen = rs;
                        this.totalProyectos = 0;
                        this.listaResumen.forEach((element)=>{
                            if(element.tarea==0){
                                this.totalProyectos += element.monto;
                            }
                                
                        })
        }, er=>console.log(er))
        }else if(this.usuarioSeleccionado != 0){
            this.servicio.getDatos("resumenDeProyectosUsuarioPagos/"+this.usuarioSeleccionado.toString()+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
                        this.listaResumen = rs;
                        this.totalProyectos = 0;
                        this.listaResumen.forEach((element)=>{
                              if(element.tarea==0){
                                this.totalProyectos += element.monto;
                                }
                        })
        }, er=>console.log(er))
        }else{
             this.servicio.getDatos("resumenDeProyectosPagosTodo/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaResumen = rs;
            this.totalProyectos = 0;
            this.listaResumen.forEach((element)=>{
                  if(element.tarea==0){
                            this.totalProyectos += element.monto;
                    }
            })
        }, er=>console.log(er))
        }
       
    }

  cargarResumenFlujo(){
        if(this.proyectoSeleccionado != 0){
            this.servicio.getDatos("resumenDeProyectosProyectoFlujo/"+this.db+"/"+this.proyectoSeleccionado.toString()+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
                        this.listaResumen = rs;
                        this.totalProyectos = 0;
                        this.listaResumen.forEach((element)=>{
                            if(element.tarea==0){
                                if(element.tema == 17){
                                    this.totalProyectos -= element.monto;
                                }else{
                                     this.totalProyectos += element.monto;
                                }
                               
                            }
                                
                        })
        }, er=>console.log(er))
        }else if(this.usuarioSeleccionado != 0){
            this.servicio.getDatos("resumenDeProyectosUsuarioFlujo/"+this.db+"/"+this.usuarioSeleccionado.toString()+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
                        this.listaResumen = rs;
                        this.totalProyectos = 0;
                        this.listaResumen.forEach((element)=>{
                            if(element.tarea==0){
                                if(element.tema == 17){
                                    this.totalProyectos -= element.monto;
                                }else{
                                     this.totalProyectos += element.monto;
                                }
                               
                            }
                        })
        }, er=>console.log(er))
        }else{
             this.servicio.getDatos("resumenDeProyectosFlujoTodo/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaResumen = rs;
            this.totalProyectos = 0;
            this.listaResumen.forEach((element)=>{
                    if(element.tarea==0){
                                if(element.tema == 17){
                                    this.totalProyectos -= element.monto;
                                }else{
                                     this.totalProyectos += element.monto;
                                }
                               
                    }
            })
        }, er=>console.log(er))
        }
       
    }

    seleccionarProyecto(proyecto){
        this.proyectoSeleccionado = proyecto;
        this.filtrosReportes();
    }

    getFiltro(){
                let hojaFiltro = this.actionSheet.create({
                    title: "Filtros",
                    buttons: [{
                        text: "Proyectos",
                        handler: ()=>{
                            this.usuarioSeleccionado = 0;
                            this.verOpcionFiltro(1);
                        }
                    },
                    {
                        text: "Responsable",
                        handler: ()=>{
                            this.proyectoSeleccionado = 0;
                            this.verOpcionFiltro(2);
                        }
                    },
                    {
                        text: "Todo",
                        handler: ()=>{
                            this.tituloPie = "";
                            this.proyectoSeleccionado = 0;
                            this.usuarioSeleccionado = 0;
                            this.filtrosReportes();
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
            this.tituloPie = "Filtro:  Responsables";
            alert.setTitle("Usuario");

            this.listaUsuarios.forEach(element => {
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
                    this.usuarioSeleccionado = id;
                    for (var key2 in this.listaUsuarios) {
                        if(this.listaUsuarios[key2].id == id ){
                            this.titulo = this.listaUsuarios[key2].nombre;
                            break; 
                        }
                    }
                }

                this.filtrosReportes();
                
                
            }
        })

        
        alert.present().then(()=>{
        
        });
    }

    getReport(){
            let hojaFiltro = this.actionSheet.create({
                    title: "Reportes",
                    buttons: [{
                        text: "Costo Proyecto",
                        handler: ()=>{
                            this.tipoReporte = 1;
                            this.filtrosReportes();
                        }
                    },
                    {
                        text: "Total Tareas",
                        handler: ()=>{
                            this.tipoReporte = 2;
                            this.filtrosReportes();
                        }
                    },
                                        {
                        text: "Ingresos",
                        handler: ()=>{
                            this.tipoReporte = 3;
                            this.filtrosReportes();
                        }
                    },
                    {
                        text: "Pagos",
                        handler: ()=>{
                            this.tipoReporte = 4;
                            this.filtrosReportes();
                        }
                    },
                    {
                        text: "Flujo",
                        handler: ()=>{
                            this.tipoReporte = 5;
                            this.filtrosReportes();
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

    filtrosReportes(){
        if(this.tipoReporte ==  1){
            this.titulo =  "  COSTO PROYECTOS";
            this.cargarResumen();
        }else if(this.tipoReporte ==  2){
            this.titulo =  "  TOTAL TAREAS";
            this.cargarResumenTareas();
        }else if(this.tipoReporte ==  3){
            this.titulo =  "  INGRESOS";
            this.cargarResumenIngresos();
        }else if(this.tipoReporte ==  4){
            this.titulo =  "  PAGOS";
            this.cargarResumenPagos();
        }else if(this.tipoReporte ==  5){
            this.titulo =  "  FLUJO";
            this.cargarResumenFlujo();
        }
    }

}