import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ConstructorService }  from '../../services/serviciosConstructor';
import { AlertController, NavParams }  from "ionic-angular";
import { VePropiedad } from "../../services/vePropiedad";
import { Proyectos } from "../../services/proyectos";
import { DatosAPP } from "../../services/datosApp";

@Component({
    selector: "veCatalogoModelosPropiedadDetalle-pages",
    templateUrl: "veCatalogoModelosPropiedadDetalle.html"
})

export class VeCatalogoModelosPropiedadDetallePage{
    form: FormGroup;
    modelo: VePropiedad;
    listaProyectos: Proyectos[];

    modeloActual: number
    nuevo: boolean;
    opcionBoton: string;
    opcionBoton2: string;
    color = "#488aff";
    id: number;
    borrar: boolean;
    db: string;
    DatosUsuario: DatosAPP;
    
    constructor(private formBuilder: FormBuilder, private servicio: ConstructorService, private alertController: AlertController,
                private navparams: NavParams){
        
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.db = this.DatosUsuario.db;

        this.modelo = this.navparams.get("modelo");

        if(this.modelo!=null && this.modelo!=undefined){

            this.modeloActual = this.modelo.id;
            this.nuevo == false;
        }else{
            this.nuevo==true;
        }
        this.cargarProyectos();
        this. crearForma();

    }

    cargarProyectos(){
        this.servicio.getDatos("proyectos/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaProyectos = rs;
        }, er=>console.log(er))
    }

    crearForma(){
        if(this.modelo==null || this.modelo==undefined){
            this.form = this.formBuilder.group({
                proyecto: [null,  Validators.required],
                descripcion: [null, Validators.required]
            });
            this.nuevo = true;
            this.opcionBoton = "Guardar";
            this.opcionBoton2 = "Cancelar";   
        }else{
            console.log(this.modelo);
            this.form = this.formBuilder.group({
            id: [this.modelo.id],
            proyecto: [this.modelo.proyecto],
            descripcion: [this.modelo.descripcion]
        });
            this.form.disable();
            this.nuevo = false;
            this.opcionBoton = "Editar";
            this.opcionBoton2 = "Borrar";  
        }
        
    }

    guardarModelo(){
        if(this.nuevo){
            this.servicio.addRegistro("modelosPropiedad/"+this.db+"/", this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
            .subscribe(  
                rs=>{
                    this.showAlert();
                    //this.id = rs.insertId;
                    this.actualizarForm(0);
                    },          
                er => console.log(er)
            );
            this.form.reset();
            this.nuevo = true;
            this.opcionBoton = "Guardar";
            this.opcionBoton2 = "Cancelar";
            this.modelo = null;
            //this.form.removeControl("id");
            this.crearForma();
        }else if(this.opcionBoton == "Guardar" && !this.nuevo){
            this.servicio.putRegistro("modelosPropiedad/"+this.db+"/", this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
                rs=>this.showAlert(),
                er=>console.log(er)
            );
            this.nuevo = false;
            this.form.disable();
            this.opcionBoton = "Editar";
            this.opcionBoton2 = "Borrar"; 
        }else{
            this.nuevo = false;
            this.form.enable();
            this.opcionBoton = "Guardar";
            this.opcionBoton2 = "Cancelar";   
        }

    }
    
    actualizarForm(id: number){
        /*let peticion = "modelosPropiedad/"+id.toString()+"/";
        this.servicio.getDatos(peticion).subscribe(rs=>{
            //this.empresa = rs[0];
            //this.form.addControl("id", this.fb.control(1));
            //this.form.controls["id"].patchValue(this.tarea.id);
            //this.empresaActual = this.empresa.id;
        },
        err=>console.log(err))

        /*this.opcionBoton = "Editar";
        this.opcionBoton2 = "Borrar";
        this.nuevo = false;*/

    }

    borrarModelo(){
        if(this.nuevo){
            this.form.reset();
        }else if(this.opcionBoton2 == "Borrar"){
            var id = this.form.controls["id"].value;
            this.servicio.delRegistro(id, "modelosPropiedad/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
                rs=>{
                    this.borrar = true;
                    this.showAlert();
                    this.form.reset();
                    this.opcionBoton = "Guardar";
                    this.opcionBoton2 = "Cancelar";
                    this.nuevo = true;
                },
                er=>console.log(er)
            );
        }else{
             this.form.disable();
            this.opcionBoton = "Editar";
            this.opcionBoton2 = "Borrar"; 
        }
            
    }

    showAlert(){
        var mensaje = "Los datos se guadaron correctamente";

        if(this.borrar){
            mensaje = "Se elimino satisfactoriamente";
            this.borrar = false;
        }

        let alert = this.alertController.create({
            title: "Modelos",
            subTitle: mensaje,
            buttons: ["Ok"]
        });

        alert.present();
    }
}