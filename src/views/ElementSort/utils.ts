import type { ElementNode } from '@/views/ElementSort/type'

export const setNode = (origin: ElementNode, target: ElementNode) => {
    origin.name = target.name
    origin.rowNumber = target.rowNumber
    origin.colNumber = target.colNumber
    origin.width = target.width
    origin.height = target.height
}
