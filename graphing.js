let Complex = require('complex.js')

class Graph{
    constructor(id, axisLineInterval, axisLineLength, canvasSize, signals){
        this.canvas = document.getElementById(id)
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

        this.signals = []
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
        center = this.canvasY/2
        cxt = this.context // Making the name shorter because it will be used a lot
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
        this.signals.forEach(signal => signal.draw(timeInstant));
    }

    addSignal(...args){
        this.signals.push(new Signal(this, ...args))
    }
}

class Signal{
    constructor(graph, equation, frequency, phi, lineColor, scaling) {
        this.graph = graph
        this.elementMax = graph.canvasX - graph.circleWinX
        this.memory = []
        this.equation = equation
        this.frequency = frequency //Cycles per second aka Hz
        this.phi = phi //Should be given in radians
        this.lineColor = lineColor
        this.creationTime = (new Date).getTime()
        this.lastTime = 0
        this.scaling = scaling //Should always be between 0 and 1
    }

    getRange(){
        /* Returns the minimum, maximum, and absolute maxmimum of the dataset (for graph vertical scaling) */
        concl = [this.memory.min, this.memory.max()]
        return {min: concl[0], max: concl[1], absMax: Math.max(abs(concl[0]), concl[1])}
    }

    draw(timeInstant){
        if (this.memory.length >= this.elementMax) this.memory.pop() //Take out the last element
        center = this.graph.circleWinX/2 //Get the vertical center (used for a lot of things)
        angleInRadian = -((timeInstant/1000)*2*Math.PI*this.frequency + this.phi) //Has to be negative because in HTML canvas positive y goes down, also /1000 because timeInstant is in ms
        currentY = center * Math.sin(angleInRadian) * this.scaling + center
        currentX = center * Math.cos(angleInRadian) * this.scaling + center
        this.memory.unshift(currentY) //Put in the first element
        //console.log(timeInstant, current - this.creationTime, current - this.lastTime)

        //Draw line inside circle
        cxt = this.graph.context
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
            cxt.lineTo(center*2 + i, this.memory[i]);
        }
        cxt.stroke();

        if (currentY == 180) {console.log((new Date).getTime())}
    }
}

window.onload = function(){
    graph1 = new Graph("myCanvas", 20, 10, {x: 288, y:108})
    graph1.addSignal(new Complex(), 0.5, 0, '#FF0000', 0.5)
    graph1.addSignal(new Complex(), 0.5, Math.PI/2, '#00FF00', 1)
    
    this.time = 0
    const timeInterval = 10
    this.timerHandler = setInterval(function(){time += timeInterval; graph1.redraw(time);}, timeInterval)

}