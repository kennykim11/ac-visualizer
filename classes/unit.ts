export class Unit{
    name: string
    currentMax: number
    receivedValues: {(id: string): any} = <{(id: string): any}>{}
    label: string

    constructor(name: string, label: string){
        this.name = name
        this.label = label
    }

    pushAndGetMax(id: string, data: number){
        this.receivedValues[id] = data

        var values: [number?] = []
        for (var key in this.receivedValues){
            if (this.receivedValues[key] == null) return this.currentMax
            values.push(this.receivedValues[key])
        }

        //All of the values in received values are numbers
        for (var key in this.receivedValues){
            this.receivedValues[key] = null
        }
        return this.currentMax = Math.max(...values)
    }
}