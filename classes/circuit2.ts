import { AngleGraph } from './angleGraph';
import { Unit } from './unit';
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
    inductance: Link = new Link('inductance', 'Inductance', 'mH', 345, 1, 1000, this.recalculate.bind(this)) //in milliHenrys
    capacitance: Link = new Link('capacitance', 'Capaciatance', 'μF', 11, 1, 100, this.recalculate.bind(this)) //in microFarads

    // === OUTPUT SIGNALS ===
    sourceVoltage: ComplexC
    sourceCurrent: ComplexC
    resistorCurrent: ComplexC
    inductorCurrent: ComplexC
    capacitorCurrent: ComplexC
    resistorImpedence: ComplexC
    inductorImpedence: ComplexC
    capacitorImpedence: ComplexC
    totalImpedence: ComplexC
    averagePower: ComplexC
    reactivePower: ComplexC
    complexPower: ComplexC

    graphs: [Graph?] = []

    // === UNITS ===
    voltageUnit = new Unit('voltage', 'V')
    currentUnit = new Unit('current',  'A')
    impedenceUnit = new Unit('impedence', 'Ω')
    powerUnit = new Unit('power', 'W/VA/VAR')
    powerLineUnit = new Unit('power', 'W/VA/VAR')

    public constructor(){
        const simSpeed = 0.5
        this.recalculate()
        var canvasWidth = window.innerWidth/6
        var canvasHeight = canvasWidth / 3
        
        var SourceV_SourceI = new Graph('canvases', 20, 10, {x: canvasWidth, y:canvasHeight})
        SourceV_SourceI.addSignal('sourceVoltage_1', 'Es', this.sourceVoltage, simSpeed, '#AAAAAA', this.voltageUnit)
        SourceV_SourceI.addSignal('sourceCurrent_1', 'Is', this.sourceCurrent, simSpeed, '#666666', this.currentUnit)
        SourceV_SourceI.addSignal('complexPower_1', 'S', this.complexPower, simSpeed, '#000000', this.powerUnit)
        this.graphs.push(SourceV_SourceI)

        var SourceI_ResI = new Graph('canvases', 20, 10, {x: canvasWidth, y:canvasHeight})
        SourceI_ResI.addSignal('sourceVoltage_2', 'Er', this.sourceVoltage, simSpeed, '#AAAAAA', this.voltageUnit)
        SourceI_ResI.addSignal('sourceCurrent_2', 'Is', this.sourceCurrent, simSpeed, '#666666', this.currentUnit)
        SourceI_ResI.addSignal('resistorCurrent', 'Ir', this.resistorCurrent, simSpeed, '#FF0000', this.currentUnit)
        this.graphs.push(SourceI_ResI)

        var SourceI_IndI = new Graph('canvases', 20, 10, {x: canvasWidth, y:canvasHeight})
        SourceI_IndI.addSignal('sourceVoltage_3', 'El', this.sourceVoltage, simSpeed, '#AAAAAA', this.voltageUnit)
        SourceI_IndI.addSignal('sourceCurrent_3', 'Is', this.sourceCurrent, simSpeed, '#666666', this.currentUnit)
        SourceI_IndI.addSignal('inductorCurrent', 'Il', this.inductorCurrent, simSpeed, '#44BBFF', this.currentUnit)
        this.graphs.push(SourceI_IndI)

        var SourceI_CapI = new Graph('canvases', 20, 10, {x: canvasWidth, y:canvasHeight})
        SourceI_CapI.addSignal('sourceVoltage_4', 'Ec', this.sourceVoltage, simSpeed, '#AAAAAA', this.voltageUnit)
        SourceI_CapI.addSignal('sourceCurrent_4', 'Is', this.sourceCurrent, simSpeed, '#666666', this.currentUnit)
        SourceI_CapI.addSignal('capacitorCurrent', 'Ic', this.capacitorCurrent, simSpeed, '#0000FF', this.currentUnit)
        this.graphs.push(SourceI_CapI)

        var impedenceGraph = new AngleGraph('canvases', 20, 10, {x: canvasHeight/2, y:canvasHeight})
        impedenceGraph.addSignal('totalImpedence', 'Zt', this.totalImpedence, simSpeed, '#dec909', this.impedenceUnit)
        impedenceGraph.addSignal('resistorImpedence', 'Zr', this.resistorImpedence, simSpeed, '#e6904e', this.impedenceUnit)
        impedenceGraph.addSignal('inductorImpedence', 'Zl', this.inductorImpedence, simSpeed, '#53edd0', this.impedenceUnit)
        impedenceGraph.addSignal('capacitorImpedence', 'Zc', this.capacitorImpedence, simSpeed, '#3fb59f', this.impedenceUnit)
        this.graphs.push(impedenceGraph)

        var powerGraph = new AngleGraph('canvases', 20, 10, {x: canvasHeight/2, y:canvasHeight})
        powerGraph.addSignal('reactivePower', 'Q', this.reactivePower, simSpeed, '#543500', this.powerLineUnit)
        powerGraph.addSignal('averagePower', 'P', this.averagePower, simSpeed, '#a36700', this.powerLineUnit)
        powerGraph.addSignal('complexPower_2', 'S', this.complexPower, simSpeed, '#7d4f00', this.powerLineUnit)
        this.graphs.push(powerGraph)
    }

    recalculate() {
        var start_time = Date.now()
        var omega = this.voltageFreq.value * 2 * Math.PI
        this.sourceVoltage = new ComplexC(this.voltagePk.value, 0)
        this.resistorImpedence = new ComplexC(this.resistance.value, 0)
        this.inductorImpedence = new ComplexC(0, this.inductance.value / 1000 * omega)
        this.capacitorImpedence = new ComplexC(0, -1/(this.capacitance.value / 1000000 * omega))
        this.totalImpedence = (this.resistorImpedence.reciprocal().add(this.inductorImpedence.reciprocal()).add(this.capacitorImpedence.reciprocal())).reciprocal()
        this.totalImpedence.imaginary *= -1
        this.sourceCurrent = this.sourceVoltage.div(this.totalImpedence)
        this.resistorCurrent = this.sourceCurrent.mult(this.totalImpedence.div(this.resistorImpedence))
        this.inductorCurrent = this.sourceCurrent.mult(this.totalImpedence.div(this.inductorImpedence), true)
        this.capacitorCurrent = this.sourceCurrent.mult(this.totalImpedence.div(this.capacitorImpedence), false)
        this.complexPower = this.sourceVoltage.mult(this.sourceCurrent)
        this.averagePower = new ComplexC(this.complexPower.real, 0)
        this.reactivePower = new ComplexC(0, this.complexPower.imaginary)
        this.graphs.forEach(graph => {
            for (var id in graph.getSignals()){
                graph.setSignal(id, this[id.split('_')[0]])
            }
        });
    }

    redraw(timeInstant: number) {
        this.graphs.forEach(graph => {
            var currentValues = graph.redraw(timeInstant)
            
            var signalsDict = graph.getSignals()
            for (var id in signalsDict){
                var text = document.getElementById(id+'Text')
                if (currentValues[id] == null) text.innerHTML = signalsDict[id].label + ' = ' + this[id.split('_')[0]].getPolarString()
                else text.innerHTML = signalsDict[id].label + ' = ' + this[id.split('_')[0]].getPolarString() + ' => ' + currentValues[id].toFixed(3)
            }
        });
    }

    kvl(){}
}