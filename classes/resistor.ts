
import { Component, ComponentType } from './component';
import { ComplexC } from '../math/complexC';

export class Resistor extends Component{
    public constructor(id: string, resistance: number){
        var values: {[key: string]: string}
        values['R'] = resistance.toString()
        values['X'] = values['R'] + '+j0'
        super(id, new ComplexC(resistance, 0), new ComplexC(0, 0), values)
        this.type = ComponentType.Resistor
    }
}