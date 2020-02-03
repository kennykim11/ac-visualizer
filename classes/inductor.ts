

import { Component, ComponentType } from './component';
import { ComplexC } from '../math/complexC';

export class Inductor extends Component{
    public constructor(id: string, inductance: number, omega: number){
        var values: {[key: string]: string}
        var reactance = inductance * omega
        values['L'] = inductance.toString()
        values['X'] = '0+j'+reactance.toString()
        super(id, new ComplexC(0, reactance), new ComplexC(0, 0), values)
        this.type = ComponentType.Inductor
    }
}