<script setup lang="ts">
import { ElButton, ElDialog, ElInput } from 'element-plus'
import { reactive, ref } from 'vue'

defineOptions({
    name: 'ElementSort',
})

const addDialog = ref(false)

const openAddDialog = () => {
    addDialog.value = true
}

const addElement = reactive<Element>({
    name: '',
    width: null,
    height: null,
})

const confirmAdd = () => {
    // 创建元素
}

const cancelAdd = () => {
    addElement.width = null
    addElement.height = null
}

const elementHashMap: (number[])[] = Array.from({ length: 10 }).fill(0).map((): number[] => {
    return Array.from({ length: 10 }).fill(0) as number[]
})

interface Element {
    name: string
    width: number
    height: number
}

const currentElement = reactive<Element>({
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

const findSafeArea = (element: Element) => {
    // 滑动窗口判断最长空间是否满足当前元素
    const l = 0
    const r = elementHashMap[0].length
    for (let row = 0; row < elementHashMap.length; row++) {
        for (let col = l; col <= r; col++) {
        }
    }
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
    <div class="vh-100 w-full bg-amber-50 grid grid-cols-10 grid-rows-10">
        1
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
