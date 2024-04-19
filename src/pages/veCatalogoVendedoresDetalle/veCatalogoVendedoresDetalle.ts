import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ConstructorService }  from '../../services/serviciosConstructor';
import { AlertController, NavParams }  from "ionic-angular";
import { VeVendedores } from "../../services/veVendedores";
import { DatosAPP } from "../../services/datosApp";

@Component({
    selector: "veCatalogoVendedoresDetalle-pages",
    templateUrl: "veCatalogoVendedoresDetalle.html"
})

export class VeCatalogoVendedoresDetallePage{

    form: FormGroup;
    vendedor: VeVendedores;

    vendedorActual: number
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
            
        this.vendedor = this.navparams.get("vendedor");

        if(this.vendedor!=null && this.vendedor!=undefined){

            this.vendedorActual = this.vendedor.id;
            this.nuevo == false;
        }else{
            this.nuevo==true;
        }
        this. crearForma();
        
    }


    crearForma(){
        if(this.vendedor==null || this.vendedor==undefined){
            this.form = this.formBuilder.group({
                nombre: [null, Validators.required]
            });
            this.nuevo = true;
            this.opcionBoton = "Guardar";
            this.opcionBoton2 = "Cancelar";   
        }else{
            this.form = this.formBuilder.group({
            id: [this.vendedor.id],
            nombre: [this.vendedor.nombre]
        });
            this.form.disable();
            this.nuevo = false;
            this.opcionBoton = "Editar";
            this.opcionBoton2 = "Borrar";  
        }
        
    }

    guardarModelo(){
        if(this.nuevo){
            this.servicio.addRegistro("veVendedores/"+this.db+"/", this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
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
            this.vendedor = null;
            //this.form.removeControl("id");
            this.crearForma();
        }else if(this.opcionBoton == "Guardar" && !this.nuevo){
            this.servicio.putRegistro("veVendedores/"+this.db+"/", this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
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
        if(this.nuevo ){
            this.form.reset();
        }else if(this.opcionBoton2 == "Borrar"){
            var id = this.form.controls["id"].value;
            this.servicio.delRegistro(id, "veVendedores/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
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