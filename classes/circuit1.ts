import { Branch } from './branch';
import { ComplexC } from './../math/complexC';
import { Matrix } from './../math/matrix';
import { Resistor } from './resistor';
import { Inductor } from './inductor';
import { Capacitor } from './capacitor';
import { VoltageSource } from './voltageSource';
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

    b1: Branch; b2: Branch; b3: Branch; b4: Branch; b5: Branch; b6: Branch; b7: Branch; b8: Branch; b9: Branch; 
    b10: Branch; b11: Branch; b12: Branch; b13: Branch; b14: Branch; b15: Branch; b16: Branch; b17: Branch; b18: Branch; b19: Branch; 

    globalOmega: number

    public constructor(){
        this.globalOmega = 60
        this.ps1 = new VoltageSource('PS1', 170, this.globalOmega, 0)
        this.c3 = new Capacitor('C3', 0.0001, this.globalOmega)
        this.c1 = new Capacitor('C1', 0.0001, this.globalOmega)
        this.l1 = new Inductor('L1', 0.0001, this.globalOmega)
        this.c2 = new Capacitor('C2', 0.0001, this.globalOmega)
        this.l2 = new Inductor('L2', 0.0001, this.globalOmega)
        this.r1 = new Resistor('R1', 1000)
    }

    recalculate(){
        var I1: ComplexC, I2: ComplexC, I3: ComplexC
        [I1, I2, I3] = this.kvl()
        this.b1.current = this.b19.current = I1
        this.b2.current = this.b3.current = I1.sub(I2)
        this.b4.current = this.b9.current = this.b18.current = I2
        this.b10.current = this.b15.current = I2.sub(I3)
        this.b16.current = this.b17.current = I3
        this.b5.current = this.b7.current = I2.mult(this.c1.X.div(this.c1.X.add(this.l1.X)))
        this.b6.current = this.b8.current = I2.mult(this.l1.X.div(this.c1.X.add(this.l1.X)))
        this.b11.current = this.b12.current = this.b10.current.mult(this.c2.X.div(this.c2.X.add(this.l2.X)))
        this.b13.current = this.b14.current = this.b10.current.mult(this.l2.X.div(this.c2.X.add(this.l2.X)))

    }

    kvl(): Array<ComplexC>{
        var matrix: Matrix = new Matrix([
            [this.c3.X, this.c3.X.neg(), new ComplexC(0, 0)],
            [this.c3.X.neg(), this.c3.X.add(this.c1.X).add(this.l1.X).add(this.l2.X).add(this.c2.X), this.l2.X.neg().sub(this.c2.X)],
            [new ComplexC(0,0), this.l2.X.neg().sub(this.c2.X), this.l2.X.add(this.c2.X).add(this.r1.X)]
        ])
        matrix.conductRref()
        return matrix.getLastSpan()
    }
}