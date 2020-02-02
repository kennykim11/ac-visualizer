import { Component } from './component';
let Complex = require('complex.js')


export class CircuitNode{
    voltage = Complex()
    current = Complex()
    inputs: Component[] //Inputs are always the componnents connected to the TOP or LEFT
    outputs: Component[] //Outputs are always the componnents connected to the BOTTOM or RIGHT

    public recalculate(){

    }
}