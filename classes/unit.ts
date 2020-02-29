export class Unit{
    name: string
    currentMax: number
    receivedValues: {(id: string): any} = <{(id: string): any}>{}

    constructor(name: string){
        this.name = name
    }

    pushAndGetMax(id: string, data: number){
        this.receivedValues[id] = data

        var values: [number?] = []
        for (var key in this.receivedValues){
            if (this.receivedValues[key] == null) return this.currentMax
            values.push(this.receivedValues[key])
        }

        //All of the values in received values are numbers
        console.log(this.currentMax)
        for (var key in this.receivedValues){
            this.receivedValues[key] = null
        }
        return this.currentMax = Math.max(...values)
    }
}