import {AbstractControl, ValidatorFn, Validators} from "@angular/forms";
import { ConstructorService } from "../services/serviciosConstructor";

export class ValidarNoMensaje{

    static valorUnico(service: ConstructorService, proyecto: number, tema:number, direccion: string, puerto: string):ValidatorFn{
        return (control: AbstractControl): {[key:number]:any} => {
            if(this.isPresent(Validators.required(control))) return null;

            var v = control.value;

            return new Promise((resolve, reject) =>  {
                service.valDocto(v, proyecto, tema, "mensajes/documento/", direccion, puerto).subscribe(data=>{
                    if(data.length>0){
                        resolve({valorUnico:true});
                    }else{
                        resolve(null);
                    }
                },
                err => resolve({valorUnico:true})
                )
            })
        }
    }
    static isPresent(obj: any): boolean{
        return obj !== undefined && obj !== null;
    }
}