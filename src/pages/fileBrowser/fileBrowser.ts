import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { File } from "@ionic-native/file";
import { Storage } from "@ionic/storage";

@Component({
  selector: 'fileBrowser-page',
  templateUrl: 'fileBrowser.html'
})

export class FileBrowserPage {

  minScreenSize: number;
  appRootFolder: string;
  deviceInfo: string;
  ListDir: any[]=[];
  pathPadre: string;
  ultimaRuta: string;
  error: string;
  directorioAbrir: string;
  plataform: string;
  directorioConstructor: string;
  crearCarpeta: boolean;

  constructor(private file: File, private storage: Storage, private viewController: ViewController) {
      
      var lb_val = true;
      this.storage.get("plataforma").then((val)=>{
            this.deviceInfo = val;
      });
      

      if(this.deviceInfo != ""){
                this.appRootFolder = this.getRootFolder(this.deviceInfo);
                this.pathPadre = this.appRootFolder;
                this.ultimaRuta = this.appRootFolder;

                file.listDir(this.appRootFolder, "").then(rs=>{
                    rs.forEach(element=>{

                        if(element.isDirectory){
                            lb_val = true;
                        }else{
                            lb_val = false;
                        }

                        this.ListDir.push({
                                directorio: lb_val,
                                nombre: element.name,
                                ruta: element.fullPath,
                                nativeUrl: element.nativeURL

                            });
                    });
                });
      }

  }

  private getRootFolder(deviceType: string):string{
    
    let returnValue: string;
    let deviceTypeStr: string = deviceType;
    
    this.storage.get("rutaConstructor").then((rs)=>{
            this.directorioConstructor = rs;
    })

    if(this.directorioConstructor.length > 0 || this.directorioConstructor!=undefined){
        returnValue = this.directorioConstructor;
    }else{
        switch(deviceTypeStr){
      case "ios":
        returnValue = this.file.documentsDirectory;//documentsDirectory
        break;
      case "android":
        returnValue = this.file.dataDirectory;//dataDirectory
        break;
      default: 
        returnValue = this.file.applicationDirectory;//dataDirectory
      }
    }

    alert(returnValue);
    return returnValue;
  }

    openDirectory(folder: string){
             let arreglo: any[]=[];
             this.file.listDir(folder, "").then(rs=>{
             rs.forEach(element=>{
                 if(element.isDirectory){
                    arreglo.push({
                        directorio: true,
                        archivo: false,
                        nombre: element.name,
                        ruta: element.fullPath,
                        nativeUrl: element.nativeURL

                    });
                 }else if (element.isFile){
                    arreglo.push({
                        directorio: false,
                        archivo: true,
                        nombre: element.name,
                        ruta: element.fullPath,
                        nativeUrl: element.nativeURL
                    });
                 }
             });
             this.ListDir = arreglo;
             this.ultimaRuta = folder;
         }, err=>{
            this.error = err;
         }).catch(err=>{
            this.error = err;
         });
    }

    returnDirectory(){
       let posicion: number;
       var pos = 0;
       posicion = this.ultimaRuta.lastIndexOf("/");
       
       do{
          this.ultimaRuta = this.ultimaRuta.substring(0, posicion);
          posicion = this.ultimaRuta.lastIndexOf("/");
          pos++;
       }while(pos<=1)

       this.ultimaRuta = this.ultimaRuta + "/"

       this.openDirectory(this.ultimaRuta);
    }

    returnFileFullPath(archivo: any){
        this.viewController.dismiss(archivo);
    }

    cancelar(){
        this.viewController.dismiss(null);
    }
    
}
