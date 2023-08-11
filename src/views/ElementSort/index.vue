<script setup lang="ts">
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
const container = ref()

const createElement = (element: Element, position: [number, number]) => {
    const ele = document.createElement('div')
    ele.className = `row-start-${position[0]} row-end-${element.height} col-start-${position[0]} col-end-${element.width} bg-black`
    console.log(ele)
    container.value.appendChild(ele)
}

const confirmAdd = () => {
    // 创建元素
    currentElement.value = {
        name: addElement.name,
        width: Number(addElement.width),
        height: Number(addElement.height),
    }
    const position = findSafeArea(currentElement.value)
    if (!position) {
        ElMessage.error('当前页面无法创建该元素')
        return
    }
    createElement(currentElement.value, position as [number, number])
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
}

const currentElement = ref<Element>({
    name: '',
    width: 0,
    height: 0,
})

const isSafe = (row: number, col: number, element: Element): boolean => {
    const rowIndexCount = elementHashMap.length - 1
    const colIndexCount = elementHashMap[0].length - 1
    let curRow = row
    let curCol = col
    if (rowIndexCount - row < element.width) return false
    if (colIndexCount - col < element.height) return false
    while (curRow <= row + element.height || curCol <= col + element.width) {
        if (elementHashMap[curRow][curCol] !== 0) return false
        if (curCol === colIndexCount) {
            curCol = col
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

const putElement = () => {

}
</script>

<template>
    <div class="h-30px w-full">
        <ElButton @click="openAddDialog">
            添加元素
        </ElButton>
    </div>
    <div ref="container" class="vh-100 w-full bg-amber-50 grid grid-cols-10 grid-rows-10">
        <div class="row-start-0 row-end-3 col-start-0 col-end-4 bg-black" />
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
