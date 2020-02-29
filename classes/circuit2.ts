import { Graph } from './graph';
import { ComplexC } from './../math/complexC';
import { Link } from './link';

import { Circuit } from './circuit';
import { start } from 'repl';
export class Circuit2 implements Circuit{
    
    // === INPUTS ===
    voltageFreq: Link = new Link('voltageFreq', 'Frequency', 'Hz', 80, 0, 1000, this.recalculate.bind(this))
    voltagePk: Link = new Link('voltagePk', 'Voltage Peak', 'Vpk', 10, 0, 100, this.recalculate.bind(this))
    resistance: Link = new Link('resistance', 'Resistance', 'Ω', 200, 1, 1000, this.recalculate.bind(this))
    inductance: Link = new Link('inductance', 'Inductance', 'mH', 345, 1, 10000, this.recalculate.bind(this)) //in milliHenrys
    capacitance: Link = new Link('capacitance', 'Capaciatance', 'μF', 11, 1, 1000, this.recalculate.bind(this)) //in microFarads

    /// === OUTPUT SIGNALS ===
    sourceVoltage: ComplexC
    sourceCurrent: ComplexC
    resistorCurrent: ComplexC
    inductorCurrent: ComplexC
    capacitorCurrent: ComplexC

    graphs: [Graph?] = []

    public constructor(){
        this.recalculate()
        
        var SourceV_SourceI = new Graph('canvases', 20, 10, {x: 288, y:108})
        SourceV_SourceI.addSignal('sourceVoltage', this.sourceVoltage, 0.5, '#888888')
        SourceV_SourceI.addSignal('sourceCurrent_1', this.sourceCurrent, 0.5, '#000000')
        this.graphs.push(SourceV_SourceI)

        var SourceI_ResI = new Graph('canvases', 20, 10, {x: 288, y:108})
        SourceI_ResI.addSignal('sourceCurrent_2', this.sourceCurrent, 0.5, '#000000')
        SourceI_ResI.addSignal('resistorCurrent', this.resistorCurrent, 0.5, '#FF0000')
        this.graphs.push(SourceI_ResI)

        var SourceI_IndI = new Graph('canvases', 20, 10, {x: 288, y:108})
        SourceI_IndI.addSignal('sourceCurrent_3', this.sourceCurrent, 0.5, '#000000')
        SourceI_IndI.addSignal('inductorCurrent', this.inductorCurrent, 0.5, '#44BBFF')
        this.graphs.push(SourceI_IndI)

        var SourceI_CapI = new Graph('canvases', 20, 10, {x: 288, y:108})
        SourceI_CapI.addSignal('sourceCurrent_4', this.sourceCurrent, 0.5, '#000000')
        SourceI_CapI.addSignal('capacitorCurrent', this.capacitorCurrent, 0.5, '#0000FF')
        this.graphs.push(SourceI_CapI)
    }

    recalculate() {
        var start_time = Date.now()
        var omega = this.voltageFreq.value * 2 * Math.PI
        this.sourceVoltage = new ComplexC(this.voltagePk.value, 0)
        var resistorImpedence = new ComplexC(this.resistance.value, 0)
        var inductorImpedence = new ComplexC(0, this.inductance.value / 1000 * omega)
        var capacitorImpedence = new ComplexC(0, -1/(this.capacitance.value / 1000000 * omega))
        var impedenceTotal = (resistorImpedence.reciprocal().add(inductorImpedence.reciprocal()).add(capacitorImpedence.reciprocal())).reciprocal()
        this.sourceCurrent = this.sourceVoltage.div(impedenceTotal)
        this.resistorCurrent = this.sourceCurrent.mult(impedenceTotal.div(resistorImpedence))
        this.inductorCurrent = this.sourceCurrent.mult(impedenceTotal.div(inductorImpedence))
        this.capacitorCurrent = this.sourceCurrent.mult(impedenceTotal.div(capacitorImpedence))
        console.log(inductorImpedence)
        console.log(capacitorImpedence)
        this.graphs.forEach(graph => {
            for (var id in graph.getSignals()){
                graph.setSignal(id, this[id.split('_')[0]])
            }
        });

        console.log(`${this.inductorCurrent.getPolarString()} = ${this.sourceCurrent.getPolarString()} * ${impedenceTotal.getPolarString()} / ${inductorImpedence.getPolarString()}`)
    }

    redraw(timeInstant: number) {
        this.graphs.forEach(graph => {
            var currentValues = graph.redraw(timeInstant)
            
            for (var id in graph.getSignals()){
                var text = document.getElementById(id+'Text')
                text.innerHTML = this[id.split('_')[0]].getPolarString() + ' => ' + currentValues[id].toFixed(3)
            }
        });
    }

    kvl(){}
}