import { ComplexC } from './../math/complexC';
import { Signal } from './signal';

export class Graph{
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D
    axisLineInterval: number
    axisLineLength: number
    scale: number
    canvasX: number
    canvasY: number
    circleWinX: number
    waveWinX: number
    signals: {(id: string): Signal}
    paused: boolean = false

    constructor(id, axisLineInterval, axisLineLength, canvasSize, signals){
        this.canvas = <HTMLCanvasElement>document.getElementById(id)
        this.context = this.canvas.getContext('2d')
        this.axisLineInterval = axisLineInterval
        this.axisLineLength = axisLineLength
        this.scale = 0
        this.canvasX = canvasSize.x //canvasSize argument should be {x: _, y: _}
        this.canvasY = canvasSize.y //canvasY also doubles as the x of the circle window
        this.circleWinX = this.canvasY //For readability
        this.waveWinX = this.canvasX - this.canvasY

        this.canvas.width = this.canvasX
        this.canvas.height = this.canvasY

        this.signals = <{(id: string): Signal}>{}
    }

    drawAxis(){
        this.context.beginPath()
        this.context.strokeStyle = '#000000AA';
        this.context.moveTo(this.circleWinX,180);
        for(var x = this.circleWinX; x<this.canvasX; x += 20){
            this.context.moveTo(x+5, this.canvasY/2);
            this.context.lineTo(x, this.canvasY/2);
        }
        this.context.stroke();
    }

    drawCircle(){
        var center = this.canvasY/2
        var cxt = this.context // Making the name shorter because it will be used a lot
        cxt.beginPath();
        cxt.strokeStyle = '#000000FF';
        cxt.arc(center, center, center, 0, 2 * Math.PI);
        cxt.stroke();

        cxt.beginPath();
        cxt.strokeStyle = '#00000022';
        cxt.moveTo(0, center)
        cxt.lineTo(center*2, center)
        cxt.moveTo(center, 0)
        cxt.lineTo(center, center*2)
        cxt.stroke();
    }

    redraw(timeInstant){
        /* Redraw the entire graph with all the signals */
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawAxis()
        this.drawCircle()
        if (!this.paused) Object.keys(this.signals).forEach(id => this.signals[id].draw(timeInstant));
    }

    addSignal(id, ...args){
        this.signals[id] = new Signal(this, ...args)
    }

    getSignals(){
        return this.signals
    }

    setSignal(id: string, equation: ComplexC){
        this.signals[id].updateEquation(equation)
    }

    pauseToggle(){
        this.paused = !this.paused
    }
}
