
import { Component, ComponentType } from './component';
import { ComplexC } from '../math/complexC';

export class VoltageSource extends Component{
    public constructor(id: string, vpp: number, omega: number, phase: number){
        var values: {[key: string]: string}
        values['Vpp'] = vpp.toString()
        values['Vrms'] = (vpp / Math.sqrt(2)).toString()
        values['Omega'] = omega.toString()
        values['Phase'] = phase.toString()
        super(id, new ComplexC(0, 0), new ComplexC(vpp*Math.cos(omega/(2*Math.PI)), vpp*Math.sin(omega/(2*Math.PI))), values)
        this.type = ComponentType.VoltageSource
    }
}