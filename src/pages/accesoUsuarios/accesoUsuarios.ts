import { Component } from '@angular/core';
import { NavController, Platform, NavParams } from 'ionic-angular';
import { SeleccionarAppPage } from "../seleccionarApp/seleccionarApp"
import { FormBuilder, FormGroup } from "@angular/forms";
import { ConstructorService } from "../../services/serviciosConstructor";

//import { RegistroCuentaPage } from "../registroCuenta/registroCuenta";
import { MenuBossPage } from "../menuBoss/menuBoss";
import { NotificacionesPage } from "../notificaciones/notificaciones";
import { MenuControlObraPage } from "../menucontrolobra/menucontrolobra";
import { MenuVentasPage } from "../menuVentas/menuVentas";
import { TutorialGPPage } from "../tutorialGP/tutorialGP";
import { Badge} from "@ionic-native/badge";
import { File }  from "@ionic-native/file";
import { DatosAPP } from "../../services/datosApp";
import {Storage} from '@ionic/storage'; 

@Component({
  selector: 'accesoUsuarios-page',
  templateUrl: 'accesoUsuarios.html'
})

export class AccesoUsuariosPage {
  plataforma: string;
  rutaConstructor: string;
  crearCarpeta: boolean;
  showToolbar:boolean = false;
  form: FormGroup ;
  strPlataforma: string;
  mssError: string;
  usuario: string;
  idUsuario: number;
  Plataforma: string;
  nombreCliente: string;
  cveUsuario: string;
  DatosUsuario: DatosAPP = {so: "", db: "", asset: "", usuario: "", empresa: "", id_usuario: 0, temp_path: "", path: "", admin: 0, direccion_local: "", direccion_remota: "", puerto: "", nombre: "", url: "", boss: 0, proyectos: 0, ventas: 0, inmuebles: 0};

  /*ionViewDidLoad(){

    this.alertasNoLeidas();

  }


  ionViewCanEnter(){
      this.alertasNoLeidas();
  }*/

  constructor(public badge: Badge, private navCtrl: NavController, platform: Platform, 
              private fb: FormBuilder, private servicio: ConstructorService, navparams: NavParams, 
              private file: File, private storage: Storage ) {
        
        this.mssError = "";
        this.Plataforma = "";
        


        platform.ready().then((plataforma)=>{
                        //this.storage.set("plataforma", plataforma);
                   });
      
                      if(platform.is("ios")){
                            this.DatosUsuario.so = "ios";
                            this.DatosUsuario.temp_path  = this.file.tempDirectory;
                            this.requestPermission();
                        }else if(platform.is("android")){
                            this.DatosUsuario.so = "android";
                            this.DatosUsuario.temp_path  = this.file.externalCacheDirectory;
                            this.requestPermission();
                        }else if(platform.is("windows")){
                            this.DatosUsuario.so = "windows";
                            this.DatosUsuario.temp_path  = this.file.tempDirectory;
                        }else if(platform.is("cordova")){
                            this.DatosUsuario.so = "cordova";
                            this.DatosUsuario.temp_path  = this.file.tempDirectory;
                        }else{
                           this.DatosUsuario.so = "desconocido";
                           this.DatosUsuario.temp_path  = this.file.tempDirectory;
                        }
                        
       this.obtenerDatos();
       this.crearForm();
       
  }

  irAConstrucor(){
    this.navCtrl.push(SeleccionarAppPage, {
      DatosUsuario: this.DatosUsuario
    });
  }

  irMenuPrincipal(boss: number, proyectos: number, ventas:number, inmuebles: number){

     if (boss == 1)
     {
        this.navCtrl.setRoot(NotificacionesPage, {
            DatosUsuario: this.DatosUsuario
       }); 
     }else
     {
        if( (proyectos == 1 && ventas==1 && inmuebles == 0 ) || (proyectos == 1 && ventas==0 && inmuebles == 1 ) || (proyectos == 0 && ventas==1 && inmuebles == 1 ) ){
            this.navCtrl.setRoot(MenuBossPage, { DatosUsuario: this.DatosUsuario});
        }else{
            if(proyectos == 1 && ventas==0 && inmuebles == 0){
               this.navCtrl.setRoot(MenuControlObraPage, { DatosUsuario: this.DatosUsuario});
            }else if(proyectos == 0 && ventas==1 && inmuebles == 0){
                this.navCtrl.setRoot(MenuVentasPage, {parametro: 1, DatosUsuario: this.DatosUsuario});
            }else if(proyectos == 0 && ventas==0 && inmuebles == 1){
               this.navCtrl.setRoot(MenuVentasPage, {parametro: 2, DatosUsuario: this.DatosUsuario});
            }
        }
     }

    
    
/*     if(boss == 1){
          this.navCtrl.push(MenuBossPage, {
                DatosUsuario: this.DatosUsuario
          });
    }else {

        if( (proyectos == 1 && ventas==1 && inmuebles == 0 ) || (proyectos == 1 && ventas==0 && inmuebles == 1 ) || (proyectos == 0 && ventas==1 && inmuebles == 1 ) ){
            this.navCtrl.push(MenuBossPage, { DatosUsuario: this.DatosUsuario});
        }else{
            if(proyectos == 1 && ventas==0 && inmuebles == 0){
               this.navCtrl.push(MenuControlObraPage, { DatosUsuario: this.DatosUsuario});
            }else if(proyectos == 0 && ventas==1 && inmuebles == 0){
                this.navCtrl.push(MenuVentasPage, {parametro: 1, DatosUsuario: this.DatosUsuario});
            }else if(proyectos == 0 && ventas==0 && inmuebles == 1){
               this.navCtrl.push(MenuVentasPage, {parametro: 2, DatosUsuario: this.DatosUsuario});
            }
        }

    }  */
  }

  crearForm(){
    
    this.form = this.fb.group({
        empresa: [this.DatosUsuario.empresa],
        usuario: [this.DatosUsuario.usuario],
        password: [""]
    });
  }

  registroCuenta(){
      this.navCtrl.push(TutorialGPPage, {DatosUsuario: this.DatosUsuario});
  }


  ionViewWillUnload(){
    //console.log("Salio den login");
   }

   validarUsuarioExistente(){

        var usuario = "";
        var password = "";
        var empresa = "";
    
        if(this.form.controls["empresa"].value != null){
          empresa = this.form.controls["empresa"].value; 
        }

        if(this.form.controls["usuario"].value != null){
          usuario = this.form.controls["usuario"].value; 
        }

        if(this.form.controls["password"].value != null){
          password = this.form.controls["password"].value; 
        }

        this.servicio.getDatos("datosEmpresa/projectgp/"+empresa, "gpconstruct.elitesystemsmexico.net","8000").subscribe(rs=>{
            if(rs.length>0){
                        
                        this.DatosUsuario.db = rs[0].db_name;
                        this.DatosUsuario.asset = rs[0].asset_name;
                        this.DatosUsuario.empresa = empresa;
                        this.DatosUsuario.usuario = usuario;
                        this.DatosUsuario.direccion_local = rs[0].direccion_local;
                        this.DatosUsuario.direccion_remota = rs[0].direccion_remota;
                        this.DatosUsuario.puerto = rs[0].puerto;

                        var url="", puerto = "";

                        if (this.DatosUsuario.puerto.length<=0){
                            puerto = "";
                        }else{
                           puerto = ":"+this.DatosUsuario.puerto;
                        }
                  
                        if (this.DatosUsuario.direccion_remota.indexOf("http")  >= 0) {
                           url = this.DatosUsuario.direccion_remota+puerto+"/";
                        }else{
                          url = "http://"+this.DatosUsuario.direccion_remota+puerto+"/";
                        }

                        this.DatosUsuario.url = url;

                        if(usuario!="" && password != ""){
                            this.servicio.getDatos("usuariosAcceso/"+this.DatosUsuario.db+"/"+usuario+"/"+password+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
                                        rs=>{
                                        if(rs.length>0){
                                            this.DatosUsuario.id_usuario = rs[0].id;
                                            this.DatosUsuario.admin = rs[0].admin;
                                            this.DatosUsuario.nombre = rs[0].nombre;
                                            this.mssError = "";
                                            this.usuario = usuario;
                                            
                                            this.storage.set('empresa', this.DatosUsuario.empresa);
                                            this.storage.set('usuario', this.DatosUsuario.usuario);

                                            this.DatosUsuario.boss = rs[0].boss;
                                            this.DatosUsuario.proyectos = rs[0].proyectos;
                                            this.DatosUsuario.ventas = rs[0].ventas;
                                            this.DatosUsuario.inmuebles = rs[0].inmuebles;

                                            if(rs[0].boss == 0 && rs[0].proyectos == 0  && rs[0].ventas == 0  && rs[0].inmuebles == 0){
                                                this.irAConstrucor();
                                            }else{
                                                this.irMenuPrincipal(rs[0].boss, rs[0].proyectos, rs[0].ventas, rs[0].inmuebles);
                                            }
                                            
                                        }else{
                                            this.mssError = "Acceso Denegado";
                                        }
                                        }, 
                                        err=>{
                                        console.log(err);
                                        }
                                    );
                    }else{
                    this.mssError = "Acceso Denegado";
                    }
            }else{
                this.mssError = "Empresa invalida";
            }
        }, err=>{console.log(err)})
        
    }

    async setBadge(badgeNumber: number){
        try{
            if (badgeNumber > 0){
                this.badge.set(badgeNumber);
            }else{
                 this.badge.clear();
            }
                
            
        }catch(e){
            console.log(e);
        }
    }  

    requestPermission(){
        try{
            let hasPermission =  this.badge.hasPermission();
            if(!hasPermission){
                this.badge.registerPermission();
            }

        }catch(e){
            console.log(e);
        }
    }

   alertasNoLeidas(){
    this.badge.clear();
        /*this.servicio.getDatos("alertas/noleidas").subscribe(
            rs=>{
                if(rs.length>0){
                    this.setBadge(rs[0].sinleer)
                }else{
                     this.badge.clear();
                }
            }, err=>{
                console.log(err);
            }
        )*/
    } 

  async obtenerDatos(){

     this.storage.get("usuario").then(val=>{
        this.form.controls['usuario'].setValue(val);
    }, error=>console.log(error))

     this.storage.get("empresa").then(val=>{
        this.form.controls['empresa'].setValue(val);
    }, error=>console.log(error))

 }

}

