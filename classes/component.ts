import { ComplexC } from '../math/complexC';

export enum ComponentType{
    VoltageSource = 'VS',
    Capacitor = 'C',
    Inductor = 'L',
    Resistor = 'R'
}

export class Component{
    id: string
    Z: ComplexC //Z for impedence
    pwr: ComplexC //Voltage source
    type: ComponentType
    values: {[key: string]: string}
    htmlElement = null

    public constructor(id: string, startingX: ComplexC, startingPwr, values: {[key: string]: string}){
        this.pwr = startingPwr
        this.Z = startingX
        this.id = id
        this.values = values
    }

    public changedValue(fieldElement){
        console.log(fieldElement.id + ' got changed to: ' + fieldElement.value)
    }
}