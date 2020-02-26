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
    r2: Component

    b1: Branch; b2: Branch; b3: Branch; b4: Branch; b5: Branch; b6: Branch; b7: Branch; b8: Branch; b9: Branch; 
    b10: Branch; b11: Branch; b12: Branch; b13: Branch; b14: Branch; b15: Branch; b16: Branch; b17: Branch; b18: Branch; b19: Branch; b20: Branch; 

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
        this.r2 = new Resistor('R2', 1000)
    }

    recalculate(){
        var I1: ComplexC, I2: ComplexC, I3: ComplexC
        [I1, I2, I3] = this.kvl()
        this.b1.current = this.b20.current = I1
        this.b3.current = this.b4.current = I1.sub(I2)
        this.b5.current = this.b10.current = this.b19.current = I2
        this.b11.current = this.b16.current = I2.sub(I3)
        this.b17.current = this.b18.current = I3
        this.b6.current = I2.mult(this.c1.Z.div(this.c1.Z.add(this.l1.Z)))
        this.b7.current = I2.mult(this.l1.Z.div(this.c1.Z.add(this.l1.Z)))
        this.b12.current = this.b11.current.mult(this.c2.Z.div(this.c2.Z.add(this.l2.Z)))
        this.b14.current = this.b11.current.mult(this.l2.Z.div(this.c2.Z.add(this.l2.Z)))

        var nodeAVoltage = this.ps1.pwr.sub(I1.mult(this.r1.Z))
        var nodeBVoltage = I3.mult(this.r2.Z)

        this.b1.voltage = this.ps1.pwr
        this.b2.voltage = this.b3.voltage = this.b5.voltage = this.b6.voltage = this.b7.voltage = nodeAVoltage
        this.b8.voltage = this.b9.voltage = this.b10.voltage = this.b11.voltage = this.b12.voltage = this.b14.voltage = this.b17.voltage = nodeBVoltage
        this.b4.voltage = this.b13.voltage = this.b15.voltage = this.b16.voltage = this.b18.voltage = this.b19.voltage = this.b20.voltage = new ComplexC(0, 0)
    }

    kvl(): Array<ComplexC>{
        var matrix: Matrix = new Matrix([
            [this.c3.Z.add(this.r1.Z), this.c3.Z.neg(), new ComplexC(0, 0), this.ps1.pwr],
            [this.c3.Z.neg(), this.c3.Z.add(this.c1.Z).add(this.l1.Z).add(this.l2.Z).add(this.c2.Z), this.l2.Z.neg().sub(this.c2.Z), new ComplexC(0,0)],
            [new ComplexC(0,0), this.l2.Z.neg().sub(this.c2.Z), this.l2.Z.add(this.c2.Z).add(this.r2.Z), new ComplexC(0, 0)]
        ])
        matrix.conductRref()
        return matrix.getLastSpan()
    }
}