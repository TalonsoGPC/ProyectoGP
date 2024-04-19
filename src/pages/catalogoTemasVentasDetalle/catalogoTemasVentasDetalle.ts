import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ConstructorService }  from '../../services/serviciosConstructor';
import { AlertController, NavParams, NavController }  from "ionic-angular";
import { TemasVentas }  from '../../services/temasVentas';
import { MenuBossPage  } from "../menuBoss/menuBoss";
import { DatosAPP } from "../../services/datosApp";
        

@Component({
    selector: "catalogoTemasVentasDetalle-pages",
    templateUrl: "catalogoTemasVentasDetalle.html"
})

export class CatalogoTemasVentasDetallePage{
    form: FormGroup;
    tema: TemasVentas;
    temActual: number
    nuevo: boolean;
    opcionBoton: string;
    opcionBoton2: string;
    color = "#488aff";
    id: number;
    borrar: boolean;
    campo_semana: number;
    campo_razonsocial: number;
    campo_monto: number;
    db: string;
    DatosUsuario: DatosAPP;

    constructor(private navCtlr: NavController, private formBuilder: FormBuilder, private servicio: ConstructorService, private alertController: AlertController,
                private navparams: NavParams){
        
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.db = this.DatosUsuario.db;
        

        this.tema = this.navparams.get("tema");

        if(this.tema!=null && this.tema!=undefined){
            this.color = this.tema.color;
            this.temActual = this.tema.id;
        }else{
            this.temActual = 20;
            this.campo_semana = 0;
            this.campo_razonsocial = 0;
            this.campo_monto= 0;
        }

        this. crearForma();
        
    }

    crearForma(){

        if(this.tema==null || this.tema==undefined){
            this.form = this.formBuilder.group({
                descripcion: [null, Validators.required],
                color: ["#0489B1"],
                imagen: ["plus.png"],
                campo_notransaccion:[0],
                campo_fecha_registro:[0],
                campo_semana:[0],
                campo_vendedor:[0],
                campo_proyecto:[0],
                campo_cliente:[0],
                campo_telefono:[0],
                campo_email:[0],
                campo_noine:[0],
                campo_noimss:[0],
                campo_noinfonavit:[0],
                campo_nofoviste:[0],
                campo_tipo_propiedad:[0],
                campo_tipo_operacion:[0],
                campo_tipo_credito:[0],
                campo_forma_pago:[0],
                campo_institucion_credito:[0],
                campo_notario:[0],
                campo_propiedad:[0],
                campo_modelo_propiedad:[0],
                campo_especificacion_propiedad:[0],
                campo_precio:[0],
                campo_avance_construccion:[0],
                campo_monto_anticipado:[0],
                campo_monto_cobrado:[0],
                campo_fecha_entrega:[0],
                campo_meses_garantia:[0],
                campo_costo_mtto:[0],
                campo_estatus_expediente:[0],
                campo_meses_contrato:[0],
                campo_dias_pago:[0],
                campo_no_pago:[0],
                campo_nota:[0],
                campo_aut_por:[0],
                campo_estatus_ventas:[0]
            });
            this.nuevo = true;
            this.opcionBoton = "Guardar";
            this.opcionBoton2 = "Cancelar";   
        }else{
            this.form = this.formBuilder.group({
            id: [this.tema.id],
            descripcion: [this.tema.descripcion, Validators.required],
            color: [this.tema.color],
            imagen: [this.tema.imagen],
            campo_notransaccion:[this.tema.campo_notransaccion],
            campo_fecha_registro:[this.tema.campo_fecha_registro],
            campo_semana:[this.tema.campo_semana],
            campo_vendedor:[this.tema.campo_vendedor],
            campo_proyecto:[this.tema.campo_proyecto],
            campo_cliente:[this.tema.campo_cliente],
            campo_telefono:[this.tema.campo_telefono],
            campo_email:[this.tema.campo_email],
            campo_noine:[this.tema.campo_noine],
            campo_noimss:[this.tema.campo_noimss],
            campo_noinfonavit:[this.tema.campo_noinfonavit],
            campo_nofoviste:[this.tema.campo_nofoviste],
            campo_tipo_propiedad:[this.tema.campo_tipo_propiedad],
            campo_tipo_operacion:[this.tema.campo_tipo_operacion],
            campo_tipo_credito:[this.tema.campo_tipo_credito],
            campo_forma_pago:[this.tema.campo_forma_pago],
            campo_institucion_credito:[this.tema.campo_institucion_credito],
            campo_notario:[this.tema.campo_notario],
            campo_propiedad:[this.tema.campo_propiedad],
            campo_modelo_propiedad:[this.tema.campo_modelo_propiedad],
            campo_especificacion_propiedad:[this.tema.campo_especificacion_propiedad],
            campo_precio:[this.tema.campo_precio],
            campo_avance_construccion:[this.tema.campo_avance_construccion],
            campo_monto_anticipado:[this.tema.campo_monto_anticipo],
            campo_monto_cobrado:[this.tema.campo_monto_cobrado],
            campo_fecha_entrega:[this.tema.campo_fecha_entrega],
            campo_meses_garantia:[this.tema.campo_meses_garantia],
            campo_costo_mtto:[this.tema.campo_costo_mtto],
            campo_estatus_expediente:[this.tema.campo_estatus],
            campo_meses_contrato:[this.tema.campo_meses_contrato],
            campo_dias_pago:[this.tema.campo_dias_pago],
            campo_no_pago:[this.tema.campo_no_pago],
            campo_nota:[this.tema.campo_nota],
            campo_aut_por:[this.tema.campo_aut_por],
            campo_estatus_ventas:[this.tema.campo_estatus_ventas]
        });
            this.form.disable();
            this.nuevo = false;
            this.opcionBoton = "Editar";
            this.opcionBoton2 = "Borrar";  

            if(this.tema.id>=1 && this.tema.id<=19){
                this.form.disable();
            } 
        }
        
    }

    guardarTema(){
        if(this.nuevo){
            this.servicio.addRegistro("temasVentas/"+this.db+"/", this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
            .subscribe(  
                rs=>{
                    this.showAlert();
                    this.id = rs.insertId;
                    this.actualizarForm(this.id);
                    },          
                er => console.log(er)
            );
            this.form.reset();
            this.nuevo = true;
            this.opcionBoton = "Guardar";
            this.opcionBoton2 = "Cancelar";
        }else if(this.opcionBoton == "Guardar" && !this.nuevo){
            this.servicio.putRegistro("temas/"+this.db+"/", this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
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
    

    }

    borrarTema(){
        if(this.nuevo){
            this.form.reset();
        }else if(this.opcionBoton2 == "Borrar"){
            var id = this.form.controls["id"].value;
            this.servicio.delRegistro(id, "temasVentas/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
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
        }
            
    }

    showAlert(){
        var mensaje = "Los datos se guadaron correctamente";

        if(this.borrar){
            mensaje = "Se elimino satisfactoriamente";
            this.borrar = false;
        }

        let alert = this.alertController.create({
            title: "Temas",
            subTitle: mensaje,
            buttons: ["Ok"]
        });

        alert.present();
    }

    actualizarDatos(datos, campo, estatus){
        console.log(datos);
        if(campo==1){
            this.form.controls["campo_semana"].patchValue(estatus);
        }else if(campo==2){
            this.form.controls["campo_razonsocial"].patchValue(estatus);
        }else if(campo==3){
            this.form.controls["campo_monto"].patchValue(estatus);
        }

        if(!this.nuevo){
             this.servicio.putRegistro("temasVentas/"+this.db+"/", this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
                rs=>console.log(rs),
                er=>console.log(er)
            );
        }

    }

    irControlObra(){
        this.navCtlr.push(MenuBossPage, {DatosUsuario: this.DatosUsuario});
    }
}

