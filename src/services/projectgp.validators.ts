import { AbstractControl, ValidatorFn, Validators } from "@angular/forms";
import  { ConstructorService } from "../services/serviciosConstructor";
import  { DatosAPP } from "../services/datosApp";

export class ProjectGPValidator{

    static validarUsuario(servicio: ConstructorService, empresa: string, direccion: string, puerto: string): ValidatorFn{

        return (control: AbstractControl): {[key:string]:any} =>{
            if(this.isPresent(Validators.required(control))) return null;
            var v = control.value;

            return new Promise((resolve, reject)=>{
                servicio.getDatos("validarUsuarioClave/"+empresa+"/"+v+"/", direccion, puerto).subscribe(data=>{
                    if(data.length > 0){
                        resolve({valorUnico: true});
                    }else{
                        resolve(null);
                    }
                }, err=> resolve({valorUnico: true}))
            })
        }

    }

    static validarEmpresa(servicio: ConstructorService, direccion: string, puerto: string): ValidatorFn{

        return (control: AbstractControl): {[key:string]:any} =>{
            if(this.isPresent(Validators.required(control))) return null;
            
            var v = control.value;

            return new Promise((resolve, reject)=>{
                servicio.getDatos("datosEmpresa/projectgp/"+v+"/", direccion, puerto).subscribe(data=>{
                    if(data.length <= 0){
                        resolve({valorUnico: true});
                    }else{
                        resolve(null);
                    }
                }, err=> resolve({valorUnico: true}))
            });
        }

    }

    static isPresent(obj: any): boolean{
        return obj !== undefined && obj !== null;
    }

}