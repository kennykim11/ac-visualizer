import { Graph } from './classes/graph';
import { Circuit2 } from './classes/circuit2'
import { ComplexC } from './math/complexC';
//let circuits = require('./classes/')

window.onload = function(){
    var boardDiv = document.getElementById('circuitBoard')
    var circ = new Circuit2()

    var time = 0
    var timeInterval = 10
    this.timerHandler = setInterval(function(){time += timeInterval; circ.redraw(time);}, timeInterval)
}