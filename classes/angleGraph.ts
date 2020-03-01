import { Unit } from './unit';
import { Graph } from './graph';
import { ComplexC } from './../math/complexC';
import { Signal } from './signal';

export class AngleGraph extends Graph{
    constructor(id: string, axisLineInterval: number, axisLineLength: number, canvasSize, signals?: {(id: string): Signal}){
        super(id, axisLineInterval, axisLineLength, canvasSize)
    }

    drawAxis(){
        this.context.lineWidth = 1
        this.context.beginPath()
        this.context.strokeStyle = '#000000AA';
        for(var x = 0; x<this.canvasX; x += this.axisLineInterval){
            this.context.moveTo(x+this.axisLineLength, this.canvasY/2);
            this.context.lineTo(x, this.canvasY/2);
        }
        this.context.moveTo(0,0)
        this.context.lineTo(1,this.canvasY)
        this.context.stroke();
    }

    drawComplexLine(signal: Signal){
        this.context.lineWidth = 2
        this.context.beginPath()
        this.context.strokeStyle = signal.lineColor
        this.context.moveTo(2, this.canvasY/2)
        this.scale = Math.min(this.canvasX, this.canvasY/2) / signal.unit.pushAndGetMax(signal.id, Math.max(Math.abs(signal.equation.real), Math.abs(signal.equation.imaginary)))
        this.context.lineTo(signal.equation.real * this.scale + 2, -1 * signal.equation.imaginary * this.scale + this.canvasY/2)
        this.context.stroke()
        return null
    }

    redraw(timeInstant): {(id: string): number}{
        /* Redraw the entire graph with all the signals */
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawAxis()
        var currentValues: {(id: string): number} = <{(id: string): number}>{}
        Object.keys(this.signals).reverse().forEach(id => {
            currentValues[id] = this.drawComplexLine(this.signals[id])
        })
        return currentValues
    }

    addSignal(id: string, label: string, ...args: [ComplexC, number, string, Unit]){
        this.signals[id] = new Signal(id, label, this, ...args)

        var textElement = document.createElement('p')
        textElement.id = id+'Text'
        textElement.style.color = args[2]
        this.span.appendChild(textElement)
    }

    getSignals(){
        return this.signals
    }

    setSignal(id: string, equation: ComplexC){
        this.signals[id].updateEquation(equation)
    }
}
