import { ComplexC } from './../math/complexC';
import { Graph } from './graph';

export class Signal{
    graph: Graph
    elementMax: number
    memory: [number?]
    equation: ComplexC
    frequency: number
    trigMagnitude: number
    phi: number //in radians
    lineColor: string
    creationTime: number
    lastTime: number
    scaling: number

    constructor(graph: Graph, equation: ComplexC, frequency: number, lineColor) {
        this.graph = graph
        this.elementMax = graph.canvasX - graph.circleWinX
        this.memory = []
        this.equation = equation
        this.frequency = frequency //Cycles per second aka Hz
        this.trigMagnitude = equation.getPolar()['mag']
        this.phi = equation.getPolar()['angle'] //Should be given in radians
        this.lineColor = lineColor
        this.creationTime = (new Date).getTime()
        this.lastTime = 0
        this.scaling = 1/this.trigMagnitude //Should always be between 0 and 1
    }

    getRange(calculatedY){
        /* Returns the minimum, maximum, and absolute maxmimum of the dataset (for graph vertical scaling) */
        var concl = [Math.min(...this.memory, calculatedY), Math.max(...this.memory, calculatedY)]
        return {min: concl[0], max: concl[1], absMax: Math.max(Math.abs(concl[0]), concl[1])}
    }

    updateEquation(newEquation: ComplexC){
        this.equation = newEquation
        this.trigMagnitude = newEquation.getPolar()['mag']
        this.phi = newEquation.getPolar()['angle']
    }

    draw(timeInstant){
        if (this.memory.length >= this.elementMax) this.memory.pop() //Take out the last element
        var center = this.graph.circleWinX/2 //Get the vertical center (used for a lot of things)
        var angleInRadian = -((timeInstant/1000)*2*Math.PI*this.frequency + this.phi) //Has to be negative because in HTML canvas positive y goes down, also /1000 because timeInstant is in ms

        var calculatedY =  Math.sin(angleInRadian) * this.trigMagnitude

        var memoryRange = this.getRange(calculatedY)
        this.scaling = 1/ memoryRange['absMax']

        var currentY = calculatedY * center * this.scaling + center
        var currentX = center * Math.cos(angleInRadian) * this.trigMagnitude * this.scaling + center
        this.memory.unshift(Math.sin(angleInRadian) * this.trigMagnitude) //Put in the first element without scaling
        //console.log(timeInstant, current - this.creationTime, current - this.lastTime)

        //Draw line inside circle
        var cxt = this.graph.context
        cxt.beginPath();
        cxt.strokeStyle = this.lineColor
        cxt.moveTo(center, center)
        cxt.lineTo(currentX, currentY)
        cxt.stroke()

        //Draw line from circle to graph
        cxt.beginPath()
        cxt.strokeStyle = this.lineColor + '44';
        cxt.moveTo(currentX, currentY)
        cxt.lineTo(center*2, currentY);
        cxt.stroke()

        //Draw graph wave
        cxt.beginPath()
        cxt.strokeStyle = this.lineColor;
        for(var i=0; i<this.memory.length; i+=1){
            cxt.lineTo(center*2 + i, this.memory[i] * center * this.scaling + center);
        }
        cxt.stroke();

        //if (currentY == 180) {console.log((new Date).getTime())}
    }
}