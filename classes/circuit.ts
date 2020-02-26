import { CircuitNode } from './circuitNode';


export interface Circuit {
    recalculate(context)
    kvl()
}