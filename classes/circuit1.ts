import { Component } from './component';
import { Circuit } from './circuit';
class Circuit1 implements Circuit{
    ps1: Component
    c3: Component
    c1: Component
    l1: Component
    c2: Component
    l2: Component
    r1: Component

    recalculate(){

    }

    kvl(){
        var matrix: Array<Array<ComplexC>>= [
            []
        ]
    }
}