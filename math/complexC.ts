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

    mult(other: ComplexC, forceSign?: boolean): ComplexC{
        var real = (this.real*other.real) - (this.imaginary*other.imaginary)
        var imaginary = this.real*other.imaginary + this.imaginary*other.real
        if (forceSign == true){
            real = Math.abs(real)
            imaginary = Math.abs(imaginary)
        }
        if (forceSign == false){
            real = -1 * Math.abs(real)
            imaginary = Math.abs(imaginary)
        }
        return new ComplexC(real, imaginary)
    }

    neg(): ComplexC{
        return new ComplexC(-1*this.real, -1*this.imaginary);
    }

    div(other: ComplexC, forceSign?: boolean): ComplexC{
        var denominator = other.real * other.real + other.imaginary * other.imaginary
        var numer1 = ((this.real * other.real) + (this.imaginary * other.imaginary))/denominator
        var numer2 = ((this.real * other.imaginary) - (this.imaginary * other.real))/denominator
        
        if (forceSign == true) numer2 = Math.abs(numer2)
        if (forceSign == false) numer2 = -1 * Math.abs(numer2)
        //console.log(`${this.getRectString()} / ${other.getRectString()} = ${new ComplexC(numer1, numer2).getRectString()}`)
        return new ComplexC(numer1, numer2)
        
        //This sputters between 90 and -90
        // var thisPolar = this.getPolar()
        // var otherPolar = other.getPolar()
        // var angle = thisPolar.angle - otherPolar.angle
        // var magnitude = thisPolar.mag / otherPolar.mag
        // return new ComplexC(magnitude * Math.cos(angle), magnitude * Math.sin(angle))
    }

    reciprocal(): ComplexC{
        var denominator = (this.real * this.real) + (this.imaginary * this.imaginary) //Results in a non-complex number
        return new ComplexC(this.real/denominator, -1*this.imaginary/denominator)
    }
}