import { median } from "./median";

const isBetween = (min: number, max: number, value: number) => {
    const medianResult = median([min, value, max])
    return !(medianResult == min || medianResult == max)
}


export default isBetween;