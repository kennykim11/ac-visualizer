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
        return `${this.real.toFixed(3)}+j${this.imaginary.toFixed(3)}`
    }

    getPolar(){
        return {mag: Math.sqrt((this.real * this.real) + (this.imaginary * this.imaginary)), angle: Math.atan(this.imaginary / this.real)}
    }

    getPolarString(){
        var polar = this.getPolar()
        return `${polar.mag.toFixed(3)}∠${(polar.angle * 180 / Math.PI).toFixed(3)}°`
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
        var denominator = other.real * other.real + other.imaginary * other.imaginary
        return new ComplexC(((this.real * other.real) + (this.imaginary + other.imaginary))/denominator, ((this.real * other.imaginary) + (this.imaginary + other.real))/denominator)
    }

    reciprocal(): ComplexC{
        var denominator = (this.real * this.real) + (this.imaginary * this.imaginary) //Results in a non-complex number
        return new ComplexC(this.real/denominator, -1*this.imaginary/denominator)
    }
}