

import { Component, ComponentType } from './component';
import { ComplexC } from '../math/complexC';

export class Capacitor extends Component{
    public constructor(id: string, capacitance: number, omega: number){
        var values: {[key: string]: string}
        var reactance = -1/(omega*capacitance)
        values['C'] = capacitance.toString()
        values['X'] = '0-j' + Math.abs(reactance).toString()
        super(id, new ComplexC(0, reactance), new ComplexC(0, 0), values)
        this.type = ComponentType.Capacitor
    }
}