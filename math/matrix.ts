class Matrix{
    data: Array<Array<number>>

    public conductRref(){

    }

    private divideRow(index: number, value: number){
        for (var i = 0; i < this.data[index].length; i++){
            this.data[index][i] /= value;
        }
    }

    private subtractRows(index1: number, index2: number){
        for (var i=0; i < this.data[index1].length; i++){
            this.data[index1][i] -= this.data[index2][i];
        }
    }
}