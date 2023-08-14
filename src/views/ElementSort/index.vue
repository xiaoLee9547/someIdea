<script setup lang="ts">
import { useElementBounding, useMouse, useWindowSize } from '@vueuse/core'
import { ElButton, ElDialog, ElInput, ElMessage } from 'element-plus'
import { reactive, ref, toRaw } from 'vue'
import { setNode } from '@/views/ElementSort/utils'
import type { ElementNode } from '@/views/ElementSort/type'

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

const allElements = reactive<ElementNode[]>([])

const container = ref()

const handleHashMap = (rowIndex: number, colIndex: number, element: ElementNode, type: 'move' | 'stay') => {
    for (let row = rowIndex; row < element.height + rowIndex; row++) {
        for (let col = colIndex; col < element.width + colIndex; col++) {
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
    handleHashMap(position[0], position[1], currentElement.value, 'stay')
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

const currentElement = ref<ElementNode>({
    name: '',
    width: 0,
    height: 0,
    rowNumber: 0,
    colNumber: 0,
})

const isSafe = (rowIndex: number, colIndex: number, element: ElementNode): boolean => {
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
    console.log(hash)
    return hash
}
let conditionHashMap: number[][] = getCurrentGridInfo()

const findSafeArea = (element: Omit<ElementNode, 'rowNumber' | 'colNumber'>) => {
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

// 当前元素点击时相对元素的位置
const currentElementOffset = reactive({
    x: 0,
    y: 0,
})

const vElement = ref<ElementNode>({
    name: '',
    width: 0,
    height: 0,
    rowNumber: 0,
    colNumber: 0,
})

const dragVElement = reactive<ElementNode>({
    rowNumber: 0,
    colNumber: 0,
    width: 0,
    height: 0,
    name: '',
})

const startDragElement = (element: ElementNode) => {
    vElement.value = structuredClone(toRaw(element))
    isDropDown.value = true
    const elementDom = document.getElementById(element.name)!
    setNode(dragVElement, element)
    currentElement.value = element
    // 元素的左上角位置
    const { x: elementX, y: elementY } = useElementBounding(ref(elementDom))
    // 元素在父容器中的相对位置
    const elementInContainerPosition = {
        x: elementX.value - containerX.value,
        y: elementY.value - containerY.value,
    }
    // 当前鼠标点击的位置
    const mouseInContainerPosition = {
        x: mouseX.value - containerX.value,
        y: mouseY.value - containerY.value,
    }
    currentElementOffset.x = mouseInContainerPosition.x - elementInContainerPosition.x
    currentElementOffset.y = mouseInContainerPosition.y - elementInContainerPosition.y
    handleHashMap(element.rowNumber - 1, element.colNumber - 1, element, 'move')
}

const calcIndex = (index: number) => {
    if (index > 9) return 9
    if (index < 0) return 0
    return index
}
// 计算当前拖拽元素所在的格子
const calcDragElementPosition = () => {
    const topValue = mouseY.value - currentElementOffset.y
    const leftValue = mouseX.value - currentElementOffset.x

    return {
        rowIndex: calcIndex(Math.round(topValue / (windowHeight.value / 10))),
        colIndex: calcIndex(Math.round(leftValue / (windowWidth.value / 10))),
    }
}

const moveElement = () => {
    if (!isDropDown.value) return
    const position = calcDragElementPosition()
    if (isSafe(position.rowIndex, position.colIndex, currentElement.value)) {
        dragVElement.rowNumber = position.rowIndex + 1
        dragVElement.colNumber = position.colIndex + 1
    }
}

const endDragElement = (element: ElementNode) => {
    element.colNumber = dragVElement.colNumber
    element.rowNumber = dragVElement.rowNumber
    handleHashMap(element.rowNumber - 1, element.colNumber - 1, element, 'stay')
    isDropDown.value = false
}
</script>

<template>
    <div class="h-30px absolute top-0 left-0 z-10">
        <ElButton @click="openAddDialog">
            添加元素
        </ElButton>
    </div>
    <div
        ref="container" class="vh-100 w-full bg-amber-50 grid grid-cols-10 grid-rows-10 gap-4px !relative" @mousemove.self="moveElement"
    >
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
                @mousedown.left.self="startDragElement(item)"
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

            @mouseup.left.self="endDragElement(currentElement)"
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
