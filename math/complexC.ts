let Complex = require('complex.js')

class ComplexC{
    //Typecript wrapper for Complex library
    v
    constructor(...args){
        this.v = Complex(...args)
    }
}