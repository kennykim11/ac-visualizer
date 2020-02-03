import { ComplexC } from './../math/complexC';

export class Branch{
    voltage: ComplexC //Measured vs other end of power source
    current: ComplexC //Always in direction of arrow
}