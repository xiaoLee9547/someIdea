<script setup lang="ts">
withDefaults(defineProps<{
    size: number
    direction: 'col' | 'row'
    images: string[]
}>(), {

})
</script>

<template>
    <div
        class="water-fall-item"
        :class="`${direction === 'col' ? `w-${size}` : `h-${size}`}px`"
    >
        <div
            v-for="image of images"
            :key="image"
            class=" overflow-hidden mt-12px box-border w-full"
        >
            <img :src="image" class="w-full h-full rounded" alt="">
        </div>
    </div>
</template>

<style scoped>

</style>
