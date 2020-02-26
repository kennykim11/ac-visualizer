import { Graph } from './graph';
import { ComplexC } from './../math/complexC';
import { Link } from './link';

import { Circuit } from './circuit';
export class Circuit2 implements Circuit{
    
    // === INPUTS ===
    voltageFreq: Link = new Link('voltageFreq', 'Frequency', 'Hz', 80, 0, 100, this.recalculate, this)
    voltagePk: Link = new Link('voltagePk', 'Voltage Peak', 'Vpk', 10, 0, 100, this.recalculate, this)
    resistance: Link = new Link('resistance', 'Resistance', 'Ω', 200, 1, 1000, this.recalculate, this)
    capacitance: Link = new Link('capacitance', 'Capaciatance', 'μF', 11, 1, 1000, this.recalculate, this) //in microFarads
    inductance: Link = new Link('inductance', 'Inductance', 'mH', 345, 1, 10000, this.recalculate, this) //in milliHenrys
    /*
    voltageFreq: Link = new Link('voltageFreq', 'Frequency', 'Hz', 80, 0, 100000, this.recalculate, this)
    voltagePk: Link = new Link('voltagePk', 'Voltage Peak', 'Vpk', 10, 0, 100, this.recalculate, this)
    resistance: Link = new Link('resistance', 'Resistance', 'Ω', 200, 1, 10000, this.recalculate, this)
    capacitance: Link = new Link('capacitance', 'Capaciatance', 'μF', 11, 1, 10000, this.recalculate, this) //in microFarads
    inductance: Link = new Link('inductance', 'Inductance', 'mH', 345, 1, 10000, this.recalculate, this) //in milliHenrys
    */

    /// === OUTPUT SIGNALS ===
    sourceVoltage: ComplexC
    sourceCurrent: ComplexC
    resistorCurrent: ComplexC
    inductorCurrent: ComplexC
    capacitorCurrent: ComplexC

    graphs: [Graph?] = []

    public constructor(){
        this.recalculate(this)
        
        var SourceV_SourceI = new Graph('SourceV_SourceI', 20, 10, {x: 288, y:108}, [])
        SourceV_SourceI.addSignal('sourceVoltage', this.sourceVoltage, 0.5, '#888888')
        SourceV_SourceI.addSignal('sourceCurrent', this.sourceCurrent, 0.5, '#000000')
        this.graphs.push(SourceV_SourceI)

        var SourceI_ResI = new Graph('SourceI_ResI', 20, 10, {x: 288, y:108}, [])
        SourceI_ResI.addSignal('sourceCurrent', this.sourceCurrent, 0.5, '#000000')
        SourceI_ResI.addSignal('resistorCurrent', this.resistorCurrent, 0.5, '#FF0000')
        this.graphs.push(SourceI_ResI)

        var SourceI_IndI = new Graph('SourceI_IndI', 20, 10, {x: 288, y:108}, [])
        SourceI_IndI.addSignal('sourceCurrent', this.sourceCurrent, 0.5, '#000000')
        SourceI_IndI.addSignal('inductorCurrent', this.inductorCurrent, 0.5, '#44BBFF')
        this.graphs.push(SourceI_IndI)

        var SourceI_CapI = new Graph('SourceI_CapI', 20, 10, {x: 288, y:108}, [])
        SourceI_CapI.addSignal('sourceCurrent', this.sourceCurrent, 0.5, '#000000')
        SourceI_CapI.addSignal('capacitorCurrent', this.capacitorCurrent, 0.5, '#0000FF')
        this.graphs.push(SourceI_CapI)
    }

    recalculate(context){
        var omega = context.voltageFreq.value * 2 * Math.PI
        context.sourceVoltage = new ComplexC(context.voltagePk.value, 0)
        var resistorImpedence = new ComplexC(context.resistance.value, 0)
        var inductorImpedence = new ComplexC(0, context.inductance.value / 1000 * omega)
        var capacitorImpedence = new ComplexC(0, -1/(context.capacitance.value / 1000000 * omega))
        var impedenceTotal = (resistorImpedence.reciprocal().add(inductorImpedence.reciprocal()).add(capacitorImpedence.reciprocal())).reciprocal()
        context.sourceCurrent = context.sourceVoltage.div(impedenceTotal)
        context.resistorCurrent = context.sourceCurrent.mult(impedenceTotal.div(resistorImpedence))
        context.inductorCurrent = context.sourceCurrent.mult(impedenceTotal.div(inductorImpedence))
        context.capacitorCurrent = context.sourceCurrent.mult(impedenceTotal.div(capacitorImpedence))
        console.log(context.sourceCurrent)
        context.graphs.forEach(graph => {
            for (var id in graph.getSignals()){
                graph.setSignal(id, context[id])
            }
        });

        console.log('impedence',inductorImpedence)
        console.log('current', context.inductorCurrent)

        document.getElementById('pauseButton').onclick  = () => this.graphs.forEach(graph => graph.pauseToggle())
    }

    redraw(timeInstant: number) {
        this.graphs.forEach(graph => graph.redraw(timeInstant));
    }

    kvl(){}
}