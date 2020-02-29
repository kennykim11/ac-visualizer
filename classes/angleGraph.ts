import { ComplexC } from './../math/complexC';
import { Signal } from './signal';

export class AngleGraph{
    canvas: HTMLCanvasElement
    span: HTMLSpanElement
    context: CanvasRenderingContext2D
    axisLineInterval: number
    axisLineLength: number
    scale: number
    canvasX: number
    canvasY: number
    signals: {(id: string): Signal}

    constructor(id: string, axisLineInterval: number, axisLineLength: number, canvasSize, signals?: {(id: string): Signal}){
        var parent = <HTMLElement>document.getElementById(id)
        this.span = document.createElement('span')
        this.canvas = document.createElement('canvas')
        this.context = this.canvas.getContext('2d')
        this.axisLineInterval = axisLineInterval
        this.axisLineLength = axisLineLength
        this.scale = 0
        this.canvasX = canvasSize.x //canvasSize argument should be {x: _, y: _}
        this.canvasY = canvasSize.y //canvasY also doubles as the x of the circle window

        this.canvas.width = this.canvasX
        this.canvas.height = this.canvasY

        this.span.appendChild(this.canvas)
        this.signals = signals || <{(id: string): Signal}>{}
        for (var id in signals){
            var textElement = document.createElement('p')
            textElement.id = id+'Text'
            textElement.style.color = signals[id].lineColor
            this.span.appendChild(textElement)
        }

        parent.appendChild(this.span)
    }

    drawAxis(){
        this.context.beginPath()
        this.context.strokeStyle = '#000000AA';
        for(var x = 0; x<this.canvasX; x += this.axisLineInterval){
            this.context.moveTo(x+this.axisLineLength, this.canvasY/2);
            this.context.lineTo(x, this.canvasY/2);
        }
        this.context.stroke();
    }

    redraw(timeInstant): {(id: string): number}{
        /* Redraw the entire graph with all the signals */
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawAxis()
        var currentValues: {(id: string): number} = <{(id: string): number}>{}
        Object.keys(this.signals).forEach(id => {
            currentValues[id] = this.signals[id].draw(timeInstant)
        })
        return currentValues
    }

    addSignal(id: string, ...args: [ComplexC, number, string]){
        this.signals[id] = new Signal(this, ...args)

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
