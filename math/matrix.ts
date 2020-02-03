import { ComplexC } from './complexC';
export class Matrix{
    data: Array<Array<ComplexC>>

    public constructor(data: Array<Array<ComplexC>>){
        this.data = data
    }

    private divideRow(index: number, value: ComplexC){
        for (var i = 0; i < this.data[index].length; i++){
            this.data[index][i].div(value);
        }
    }

    private subtractRows(index1: number, index2: number){
        for (var i=0; i < this.data[index1].length; i++){
            this.data[index1][i] = this.data[index1][i].sub(this.data[index2][i]);
        }
    }

    private makeRowAPivot(targetRowIndex){
        this.divideRow(targetRowIndex, this.data[targetRowIndex][0])
        for (var i=0; i<targetRowIndex; i++){
            this.divideRow(targetRowIndex, this.data[targetRowIndex][i])
            this.subtractRows(targetRowIndex, i)
            this.divideRow(targetRowIndex, this.data[targetRowIndex][targetRowIndex])
        }
    }

    private makeRowOnlyPivot(targetRowIndex){
        for (var i=0; i<targetRowIndex; i++){
            this.divideRow(targetRowIndex, this.data[targetRowIndex][i])
            this.subtractRows(targetRowIndex, i)
            this.divideRow(targetRowIndex, this.data[targetRowIndex][targetRowIndex])
        }
    }

    public conductRref(){
        for (var i=0; i<this.data.length; i++){
            this.makeRowAPivot(i)
        }
        for (var i = this.data.length-2; i>=0; i--){
            this.makeRowOnlyPivot(i)
        }
    }

    public getLastSpan(): Array<ComplexC>{
        var concl: Array<ComplexC>
        this.data.forEach(row => concl.push(row[row.length-1]))
        return concl
    }
}