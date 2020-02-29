import { Circuit2 } from './circuit2';
export class Link{
    /*
    Intermidiary class between slider and JS. When user edits the slider, value will change and the callback will be called
    */

    value: number
    units: string

    public constructor(id: string, label: string, units: string, defaultValue: number, minimum: number, maximum: number, recalculateCallback: () => void){

        this.units = units
        this.value = defaultValue

        const sliderElement = <HTMLInputElement> document.createElement('input')
        sliderElement.id = id+'Slider'
        sliderElement.className = 'slider'
        sliderElement.type = 'range'
        sliderElement.setAttribute('min', minimum.toString())
        sliderElement.setAttribute('max', maximum.toString())
        sliderElement.value = defaultValue.toString()

        const lineBreak = <HTMLElement> document.createElement('br')

        const nameLabel = <HTMLLabelElement> document.createElement('label')
        nameLabel.textContent = label + ':  '

        const valueElement = <HTMLInputElement> document.createElement('input')
        valueElement.id = id+'Value'
        valueElement.className = 'number'
        valueElement.type = 'number'
        valueElement.setAttribute('min', minimum.toString())
        valueElement.setAttribute('max', maximum.toString())
        valueElement.value = defaultValue.toString()

        const unitLabel = <HTMLLabelElement> document.createElement('label')
        unitLabel.textContent = units

        sliderElement.oninput = () => { //Required for using "this"
            this.value = parseInt(sliderElement.value)
            valueElement.value = sliderElement.value
            recalculateCallback()
        }

        valueElement.onchange = () => {
            this.value = parseInt(valueElement.value)
            sliderElement.value = valueElement.value
            recalculateCallback()
        }

        const lineBreak2 = <HTMLElement> document.createElement('br')

        const fieldBox = <HTMLDivElement> document.createElement('div')
        fieldBox.className = 'fieldBox'
        fieldBox.appendChild(sliderElement)
        fieldBox.appendChild(lineBreak)
        fieldBox.appendChild(nameLabel)
        fieldBox.appendChild(valueElement)
        fieldBox.appendChild(unitLabel)
        fieldBox.appendChild(lineBreak2)

        const settingsBar = <HTMLDivElement> document.getElementById('settingsBar')
        settingsBar.appendChild(fieldBox)

    }

    /*
    public constructor(id: string, label: string, units: string, defaultValue: number, minimum: number, maximum: number, recalculateCallback: (context) => void, context){
        this.units = units
        const sliderElement = <HTMLInputElement> document.getElementById(id+'Slider')
        console.log(id+'Slider')
        const valueElement = <HTMLParagraphElement> document.getElementById(id+'Value')
        sliderElement.setAttribute('min', minimum.toString())
        sliderElement.setAttribute('max', maximum.toString())
        sliderElement.value = defaultValue.toString()
        valueElement.textContent = label + ' = ' + sliderElement.value + units
        sliderElement.oninput = () => { //Required for using "this"
            this.value = parseInt(sliderElement.value)
            valueElement.textContent = label + sliderElement.value + units
            console.log(sliderElement.value)
            recalculateCallback(context)
        }
    }
    */
}