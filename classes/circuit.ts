import { CircuitNode } from './circuitNode';


export class Circuit {
    nodes: CircuitNode[]

    public constructor(init?:Partial<Circuit>) {
        Object.assign(this, init);
    }

    public recalculate(){

    }
}