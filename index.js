let Complex = require('complex.js')
import { Component } from './classes/component';
//let circuits = require('./classes/')

window.document.onload = function(){
    var a = Complex('1+2i')
    var b = Complex('2+i')
    var c = a + b
    console.log(c)
    
    boardDiv = document.getElementById('circuitBoard')
    child = Component('dcSource', {'Resistance': 15}, 240, 'RIGHT').htmlElement
    console.log(child)
    boardDiv.appendChild(child)
    
}