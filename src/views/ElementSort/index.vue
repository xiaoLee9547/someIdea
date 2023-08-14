<script setup lang="ts">
import { useElementBounding, useMouse, useWindowSize } from '@vueuse/core'
import { ElButton, ElDialog, ElInput, ElMessage } from 'element-plus'
import { reactive, ref, toRaw } from 'vue'

defineOptions({
    name: 'ElementSort',
})

const addDialog = ref(false)

const openAddDialog = () => {
    addDialog.value = true
}

const addElement = reactive({
    name: '',
    width: '',
    height: '',
})

const allElements = reactive<Element[]>([])

const container = ref()

const handleHashMap = (rowIndex: number, colIndex: number, element: Element, type: 'move' | 'stay') => {
    for (let row = rowIndex; row < element.height + rowIndex; row++) {
        for (let col = colIndex; col < element.height + colIndex; col++) {
            elementHashMap[row][col] = type === 'move' ? 0 : 1
        }
    }
    conditionHashMap = getCurrentGridInfo()
}

const confirmAdd = () => {
    const repeatElement = allElements.find((item) => {
        return item.name === addElement.name
    })
    if (repeatElement) {
        ElMessage.error('不能创建同名元素')
        return
    }
    const position = findSafeArea({
        name: addElement.name,
        width: Number(addElement.width),
        height: Number(addElement.height),
    })
    if (!position) {
        ElMessage.error('当前页面无法创建该元素')
        return
    }
    // 创建元素
    currentElement.value = {
        name: addElement.name,
        width: Number(addElement.width),
        height: Number(addElement.height),
        rowNumber: position[0] + 1,
        colNumber: position[1] + 1,
    }
    allElements.push(currentElement.value)
    handleHashMap(currentElement.value.rowNumber - 1, currentElement.value.colNumber - 1, currentElement.value, 'stay')
    addDialog.value = false
}

const cancelAdd = () => {
    addElement.width = ''
    addElement.height = '0'
    addDialog.value = false
}

const elementHashMap: (number[])[] = Array.from({ length: 10 }).fill(0).map((): number[] => {
    return Array.from({ length: 10 }).fill(0) as number[]
})

interface Element {
    name: string
    width: number
    height: number
    rowNumber: number
    colNumber: number
}

const currentElement = ref<Element>({
    name: '',
    width: 0,
    height: 0,
    rowNumber: 0,
    colNumber: 0,
})

const isSafe = (rowIndex: number, colIndex: number, element: Element): boolean => {
    const rowIndexCount = elementHashMap.length - 1
    const colIndexCount = elementHashMap[0].length - 1
    // 判断是否越界
    if (rowIndexCount - rowIndex + 1 < element.width) return false
    if (colIndexCount - colIndex + 1 < element.height) return false
    // 判断是否有元素
    let curRow = rowIndex
    let curCol = colIndex
    while (curRow < rowIndex + element.height && curCol < colIndex + element.width) {
        if (elementHashMap[curRow][curCol] !== 0) return false
        if (curCol === colIndexCount) {
            curCol = colIndex
            curRow++
        } else {
            curCol++
        }
    }
    return true
}

const getCurrentGridInfo = () => {
    const hash = Array.from({ length: 10 }).fill(0).map((): number[] => {
        return Array.from({ length: 10 }).fill(0) as number[]
    })
    // 滑动窗口及hash存储判断最长空间
    for (let row = 0; row < hash.length; row++) {
        let count = 0
        for (let col = 0; col < hash[0].length; col++) {
            if (elementHashMap[row][col] === 0) {
                let num = ++count
                while (num > 0) {
                    hash[row][col - num + 1]++
                    num--
                }
            } else {
                count = 0
            }
        }
    }
    return hash
}
let conditionHashMap: number[][] = getCurrentGridInfo()

const findSafeArea = (element: Omit<Element, 'rowNumber' | 'colNumber'>) => {
    for (let row = 0; row < conditionHashMap.length; row++) {
        for (let col = 0; col < conditionHashMap.length; col++) {
            if (conditionHashMap[row][col] >= element.width) {
                let rowCount = element.height - 1
                let beginRow = row + 1
                let flag = true
                while (rowCount) {
                    if (conditionHashMap[beginRow][col] >= element.width) {
                        beginRow++
                        rowCount--
                    } else {
                        flag = false
                        break
                    }
                }
                if (flag) return [row, col]
            }
        }
    }
    return false
}

const { x: mouseX, y: mouseY } = useMouse()

const { x: containerX, y: containerY } = useElementBounding(container)

const { width: windowWidth, height: windowHeight } = useWindowSize()

const isDropDown = ref(false)

const currentElementDom = ref<HTMLElement>(document.getElementById('vElement')!)

const currentElementOffset = reactive({
    x: 0,
    y: 0,
})

const vElement = ref<Element>({
    name: 'v-element',
    width: 0,
    height: 0,
    rowNumber: 0,
    colNumber: 0,
})

const startDragElement = (element: Element) => {
    vElement.value = structuredClone(toRaw(element))
    isDropDown.value = true
    const elementDom = document.getElementById(element.name)!
    dragVElement.height = element.height
    dragVElement.width = element.width
    dragVElement.rowNumber = element.rowNumber
    dragVElement.colNumber = element.colNumber
    dragVElement.name = element.name
    currentElement.value = element
    const { x: elementX, y: elementY } = useElementBounding(ref(elementDom))
    const elementInContainerPosition = {
        x: elementX.value - containerX.value,
        y: elementY.value - containerY.value,
    }
    const mouseInContainerPosition = {
        x: mouseX.value - containerX.value,
        y: mouseY.value - containerY.value,
    }
    currentElementOffset.x = mouseInContainerPosition.x - elementInContainerPosition.x
    currentElementOffset.y = mouseInContainerPosition.y - elementInContainerPosition.y
    handleHashMap(element.rowNumber - 1, element.colNumber - 1, element, 'move')
}

const dragVElement = reactive<Element>({
    rowNumber: 0,
    colNumber: 0,
    width: 0,
    height: 0,
    name: '',
})

const moveElement = () => {
    if (!isDropDown.value) return
    const topValue = mouseY.value - containerY.value - currentElementOffset.y
    const leftValue = mouseX.value - containerX.value - currentElementOffset.x
    // currentElementDom.value.style.top = `${String(x.value)}px`
    // currentElementDom.value.style.left = `${String(y.value)}px`
    // 计算当前元素所在的格子
    const rowIndex = Math.floor(topValue / (windowHeight.value / 10)) > 9 ? 9 : Math.floor(topValue / (windowHeight.value / 10)) < 0 ? 0 : Math.floor(topValue / (windowHeight.value / 10))
    const colIndex = Math.floor(leftValue / (windowWidth.value / 10)) > 9 ? 9 : Math.floor(leftValue / (windowHeight.value / 10)) < 0 ? 0 : Math.floor(leftValue / (windowHeight.value / 10))
    if (isSafe(rowIndex, colIndex, currentElement.value)) {
        dragVElement.rowNumber = rowIndex + 1
        dragVElement.colNumber = colIndex + 1
    }
}

const endDragElement = (element: Element) => {
    const topValue = mouseY.value - containerY.value - currentElementOffset.y
    const leftValue = mouseX.value - containerX.value - currentElementOffset.x
    // 计算当前元素所在的格子
    const rowIndex = Math.floor(topValue / (windowHeight.value / 10)) > 9 ? 9 : Math.floor(topValue / (windowHeight.value / 10)) < 0 ? 0 : Math.floor(topValue / (windowHeight.value / 10))
    const colIndex = Math.floor(leftValue / (windowWidth.value / 10)) > 9 ? 9 : Math.floor(leftValue / (windowHeight.value / 10)) < 0 ? 0 : Math.floor(leftValue / (windowHeight.value / 10))
    const isSafeRes = isSafe(rowIndex, colIndex, currentElement.value)
    element.colNumber = isSafeRes ? colIndex + 1 : currentElement.value.colNumber
    element.rowNumber = isSafeRes ? rowIndex + 1 : currentElement.value.rowNumber
    handleHashMap(element.rowNumber, element.colNumber, element, 'stay')
    isDropDown.value = false
}
</script>

<template>
    <div class="h-30px absolute top-0 left-0 z-10">
        <ElButton @click="openAddDialog">
            添加元素
        </ElButton>
    </div>
    <div ref="container" class="vh-100 w-full bg-amber-50 grid grid-cols-10 grid-rows-10 gap-4px !relative" @mousemove="moveElement">
        <template v-for="item in allElements" :key="item.name">
            <div
                :id="item.name"
                class="bg-sky-200 flex justify-center items-center text-6xl rounded-xl overflow-hidden"
                :style="{
                    gridRowStart: item.rowNumber,
                    gridRowEnd: item.height + item.rowNumber,
                    gridColumnStart: item.colNumber,
                    gridColumnEnd: item.width + item.colNumber,
                }"
                @mousedown.left="startDragElement(item)"
            >
                {{ item.name }}
            </div>
        </template>
        <div
            v-show="isDropDown"
            id="vElement"
            class="bg-sky-200 flex justify-center items-center text-6xl rounded-xl overflow-hidden opacity-50"
            :style="{
                gridRowStart: vElement.rowNumber,
                gridRowEnd: vElement.height + vElement.rowNumber,
                gridColumnStart: vElement.colNumber,
                gridColumnEnd: vElement.width + vElement.colNumber,
            }"
        >
            {{ vElement.name }}
        </div>
        <div
            v-show="isDropDown"
            id="dragVElement"
            class="bg-sky-200 flex justify-center items-center text-6xl rounded-xl border-2 border-dotted overflow-hidden opacity-50"
            :style="{
                gridRowStart: dragVElement.rowNumber,
                gridRowEnd: dragVElement.height + dragVElement.rowNumber,
                gridColumnStart: dragVElement.colNumber,
                gridColumnEnd: dragVElement.width + dragVElement.colNumber,
            }"
            @mouseup.left="endDragElement(currentElement)"
        >
            {{ dragVElement.name }}
        </div>
    </div>

    <ElDialog
        v-model="addDialog"
        width="400"
        close-on-click-modal
    >
        <ElInput v-model="addElement.name" placeholder="元素名称" />
        <ElInput v-model="addElement.width" placeholder="宽度" />
        <ElInput v-model="addElement.height" placeholder="高度" />
        <template #footer>
            <ElButton @click="confirmAdd">
                确认添加
            </ElButton>
            <ElButton @click="cancelAdd">
                取消添加
            </ElButton>
        </template>
    </ElDialog>
</template>

<style scoped>

</style>
