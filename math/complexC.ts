
export class ComplexC{
    real: number
    imaginary: number

    constructor(real: number, imaginary: number, stringRep?: string){
        if (stringRep){
            
        }
        this.real = real
        this.imaginary = imaginary
    }

    getRectString(){
        return `${this.real.toString()}+j${this.imaginary.toString()}`
    }

    getPolar(){
        return {'mag': Math.sqrt((this.real * this.real) + (this.imaginary * this.imaginary)), 'angle': Math.atan(this.imaginary / this.real)}
    }

    getPolarString(){
        var polar = this.getPolar()
        return `${polar.mag}∠${polar.angle}°`
    }

    add(other: ComplexC): ComplexC{
        return new ComplexC(this.real+other.real, this.imaginary+other.imaginary)
    }

    sub(other: ComplexC): ComplexC{
        return new ComplexC(this.real-other.real, this.imaginary-other.imaginary)
    }

    mult(other: ComplexC): ComplexC{
        return new ComplexC((this.real*other.real) - (this.imaginary*other.imaginary), this.real*other.imaginary + this.imaginary*other.real)
    }

    neg(): ComplexC{
        return new ComplexC(-1*this.real, -1*this.imaginary);
    }

    div(other: ComplexC): ComplexC{
        var thisPolar = this.getPolar()
        var otherPolar = other.getPolar()
        var totalMag = thisPolar.mag + otherPolar.mag
        var totalAngle = thisPolar.angle + otherPolar.angle
        return new ComplexC(totalMag*Math.cos(totalAngle), totalAngle*Math.sin(totalAngle))
    }
}