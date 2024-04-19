import { Component, NgZone } from "@angular/core";
import { Usuarios } from "../../services/usuarios";
import { ConstructorService }  from '../../services/serviciosConstructor';
import { Proyectos }  from '../../services/proyectos';
import { AlertController, NavParams, NavController, LoadingController, Loading, Events }  from "ionic-angular";
import { DatosAPP }  from '../../services/datosApp';


@Component({
    selector: "permisosusuarioproyecto-page",
    templateUrl: "permisosUsuarioProyecto.html"
})


export class PermisosUsuarioProyectoPage{
    listaUsuariosProyecto: any[]=[];
    proyectoSeleccionado: Proyectos;
    DatosUsuario: DatosAPP;
    loading: Loading;

    constructor(private servicio: ConstructorService, private navparams: NavParams, private alertCtrl: AlertController, 
               private loadingCtlr: LoadingController, private events: Events, private zone: NgZone){
        this.proyectoSeleccionado = this.navparams.get("proyectoSeleccionado");
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.cargarUsuariosProyecto();
        this.events.subscribe('updateScreen', ()=>{
            this.zone.run(()=>{
                this.cargarUsuariosProyecto();
            });
        });
    }

    cargarUsuariosProyecto(){
        this.servicio.getDatos("permisosProyectoUsuario/"+this.DatosUsuario.db+"/"+this.proyectoSeleccionado.numproy, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
            this.listaUsuariosProyecto = rs
        }, err=>{console.log(err)})
    }

    agregarUsuarios(){
        let listaUsuarios: any[]=[];
        this.loading = this.loadingCtlr.create({
            content: "Actualizando permisos..."
        });

        this.servicio.getDatos("obtenerUsuariosSinPermisosProyecto/"+this.DatosUsuario.db+"/"+this.proyectoSeleccionado.numproy, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
            
            if (rs.length>0){
                
                let alert = this.alertCtrl.create();
                alert.setTitle('Usuarios');
    
                rs.forEach(element => {
                    alert.addInput({
                        type: 'checkbox',
                        label: element.cveusuario,
                        value: element.id
                      });
                });
                
                alert.addButton('Cancel');
                alert.addButton({
                text: 'Ok',
                handler: data => {
                    if (data.length>0){
                        this.loading.present();
                        data.forEach(element => {
                            this.servicio.addRegistro("usuariosProyectos/"+this.DatosUsuario.db+"/", {id_usuario: element, id_proyecto: this.proyectoSeleccionado.numproy}, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
                                this.events.publish("updateScreen");
                            }, err=>console.log(err));
                        });
                        
                        this.loading.dismiss();
                    }
                }
                });
                alert.present();
            }

           
        }, err=>{console.log(err)})
    }

    borrarUsuario(item:any){
        this.servicio.delRegistro(item.id_proyecto, "usuariosProyectos/"+this.DatosUsuario.db+"/"+item.id_usuario+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
                        this.events.publish("updateScreen");
                    }, err=>console.log(err));
    }
        
} 