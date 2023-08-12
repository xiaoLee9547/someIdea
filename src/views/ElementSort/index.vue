<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { ElButton, ElDialog, ElInput, ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'

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
}

const confirmAdd = () => {
    const repeatElement = allElements.find((item) => {
        return item.name === addElement.name
    })
    if (repeatElement) {
        ElMessage.error('不能创建同名元素')
        return
    }
    const position = findSafeArea(currentElement.value)
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
    while (curRow <= rowIndex + element.height && curCol <= colIndex + element.width) {
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
    // 滑动窗口及hash存储判断最长空间
    const hash = Array.from({ length: 10 }).fill(0).map((): number[] => {
        return Array.from({ length: 10 }).fill(0) as number[]
    })
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

const findSafeArea = (element: Element) => {
    const info = getCurrentGridInfo()
    for (let row = 0; row < info.length; row++) {
        for (let col = 0; col < info.length; col++) {
            if (info[row][col] >= element.width) {
                let rowCount = element.height
                let beginRow = row
                while (rowCount) {
                    if (info[beginRow][col] >= element.width) {
                        beginRow++
                        rowCount--
                    } else {
                        break
                    }
                }
                return [row, col]
            }
        }
    }
    return false
}

const { width: windowWidth, height: windowHeight } = useWindowSize()
const endDrag = (e: DragEvent, element: Element) => {
    currentElement.value = element
    const movedCol = Math.floor(e.offsetX / (windowWidth.value / 10))
    const movedRow = Math.floor(e.offsetY / (windowHeight.value / 10))
    if (isSafe(movedRow, movedCol, element)) {
        handleHashMap(currentElement.value.rowNumber - 1, currentElement.value.colNumber - 1, currentElement.value, 'move')
        currentElement.value.rowNumber = movedRow + 1
        currentElement.value.colNumber = movedCol + 1
        handleHashMap(currentElement.value.rowNumber - 1, currentElement.value.colNumber - 1, currentElement.value, 'stay')
    }
}
const test = (e) => {
    console.log(e)
}
</script>

<template>
    <div class="h-30px w-full absolute top-0 left-0 z-10">
        <ElButton @click="openAddDialog">
            添加元素
        </ElButton>
    </div>
    <div ref="container" class="vh-100 bg-amber-50 grid grid-cols-10 grid-rows-10 gap-4px !relative">
        <template v-for="item in allElements" :key="item.name">
            <div
                draggable="true"
                class="bg-black grid"
                :style="{
                    gridRowStart: item.rowNumber,
                    gridRowEnd: item.height + item.rowNumber,
                    gridColumnStart: item.colNumber,
                    gridColumnEnd: item.width + item.colNumber,
                }"
                @drag="test"
                @dragend="endDrag($event, item)"
            />
        </template>
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
