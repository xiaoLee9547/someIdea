<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { computed, onMounted, reactive, toRaw, watch } from 'vue'
import WaterFallItem from '@/components/waterFall/waterFallItem.vue'

const props = withDefaults(defineProps<{
    elementSize: number | string

    direction?: 'row' | 'col'

    colNum?: number
}>(), {
    elementSize: 300,
    direction: 'col',
})

interface imgInfo {
    height: number
    url: string
}
const allImage = reactive<imgInfo[]>([])

const randomImageData = async () => {
    return Array.from({ length: 20 }).fill(0).map(
        () => {
            const height = Number.parseInt(String(Math.random() * 200 + 100))
            const size = `${props.elementSize}/${height}`
            return {
                height,
                url: `https://picsum.photos/${size}`,
            }
        },
    )
}

const elementsHeightRecord = reactive<number[]>([])

const { width } = useWindowSize()

const calcElementHeight = () => {
    allColsImage.length = 0
    elementsHeightRecord.length = 0
    const elements = document.getElementsByClassName('water-fall-item')
    if (!elements.length) return

    Array.from({ length: colCount.value }).forEach((item, index) => {
        allColsImage.push([])
        elementsHeightRecord[index] = elements[index]?.clientHeight
    })
}

const getImageInfo = (url: string): Promise<imgInfo> => {
    return new Promise((resolve) => {
        const img = new Image()

        img.src = url

        img.onload = function () {
            resolve({
                height: img.height,
                url: img.src,
            })
        }
    })
}

const pushImage = () => {
    const imageData = structuredClone(toRaw(allImage))
    while (imageData.length > 0) {
        let minHeightIndex = -1
        let minNumber = Number.MAX_SAFE_INTEGER
        elementsHeightRecord.forEach((item, index) => {
            const minNumberCopy = minNumber
            minNumber = Math.min(minNumber, item)
            if (minNumber !== minNumberCopy) minHeightIndex = index
        })
        const image = imageData.shift()
        elementsHeightRecord[minHeightIndex] += image.height
        allColsImage[minHeightIndex].push(image.url)
    }
}

const calcElementAndPushImage = () => {
    calcElementHeight()
    pushImage()
}

const allColsImage = reactive<string[][]>([])

const colCount = computed(() => props.colNum ?? Math.floor(width.value / Number(props.elementSize)))

// watch(colCount, () => {
//     calcElementAndPushImage()
// })

onMounted(() => {
    calcElementHeight()
})

const getImages = async () => {
    const data = await randomImageData()
    allImage.push(...data)
    pushImage()
}

getImages()

const element = reactive([])

const refFn = (el) => {
    element.push(el)
}

watch(element, () => {
    console.log(element)
})
</script>

<template>
    <div class="flex flex-row flex-wrap justify-between vw-100 p-24px">
        <template v-for="(item, index) of Array.from({ length: colCount }).fill(0)" :key="index">
            <WaterFallItem
                :ref="refFn"
                :size="elementSize"
                :direction="direction"
                :images="allColsImage[index]"
            />
        </template>
    </div>
</template>
