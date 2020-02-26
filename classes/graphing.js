


window.onload = function(){
    graph1 = new Graph("myCanvas", 20, 10, {x: 288, y:108})
    //graph1.addSignal(new Complex(), 0.5, 0, '#FF0000', 0.5)
    //graph1.addSignal(new Complex(), 0.5, Math.PI/2, '#00FF00', 1)
    
    this.time = 0
    const timeInterval = 10
    this.timerHandler = setInterval(function(){time += timeInterval; graph1.redraw(time);}, timeInterval)

}