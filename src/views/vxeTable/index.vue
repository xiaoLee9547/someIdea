<script setup lang="ts">
import { ref } from 'vue'
import { VxeColumn, VxeTable } from 'vxe-table'
import 'vxe-table/lib/style.css'
import Mock from 'mockjs/dist/mock'

const tem = {
    // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
    'data|10-20': [{
        budgetType: '@number()',
        committeeSubmit: '@number()',
        deptName: '@name()',
        relevantDeptName: 'sss',
        year: '2024',
        creatorId: '@id',
        creatorName: 'aaa',
        modifierId: '@id',
        budgetNumber: '00120240976',
        orgId: '@id',
        budgetProgress: 2,
        projectCode: '@guid',
        deptOneUp: 0,
        id: '@id',
        issued: 2,
        totalWay: 1,
        orgName: '@name()',
        reldeptSubmit: 1,
        deptId: '@id',
        parentId: '@id',
        unit: '@name()',
        relevantDeptId: '@id',
        deptSubmit: 2,
        modifierName: '@name()',
        projectName: '@name()',
        isSum: 2,
        projectId: '@id',
        ts: '2023-08-04 17:07:52',
    }],
}

const temp = {
    // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
    'data|200-300': [{
        budgetType: '@number()',
        committeeSubmit: '@number()',
        deptName: '@name()',
        relevantDeptName: 'sss',
        year: '2024',
        creatorId: '@id',
        creatorName: 'aaa',
        modifierId: '@id',
        budgetNumber: '00120240976',
        orgId: '@id',
        budgetProgress: 2,
        projectCode: '@guid',
        deptOneUp: 0,
        id: '@id',
        issued: 2,
        totalWay: 1,
        orgName: '@name()',
        reldeptSubmit: 1,
        deptId: '@id',
        parentId: '@id',
        unit: '@name()',
        relevantDeptId: '@id',
        deptSubmit: 2,
        modifierName: '@name()',
        projectName: '@name()',
        isSum: 2,
        projectId: '@id',
        ts: '2023-08-04 17:07:52',
    }],
}

const data = Mock.mock(tem).data.map((item) => {
    item.children = Mock.mock(temp).data
    return item
})
console.log(data)

const tableHeader = ref([
    { label: 'id', prop: 'id', center: 'right', hidden: true },
    { label: 'a', width: '140', prop: 'budgetProgress', center: 'left', type: 'slot', slotName: 'schedule' },
    { label: 'b', width: '100', prop: 'budgetNumber', center: 'left' },
    { label: 'd', width: '100', prop: 'relevantDeptName', center: 'left' },
    { label: 'c', width: '100', prop: 'deptName', center: 'left' },
    { label: 'e', width: '', prop: 'projectName', center: 'left' },
    { label: 'f', width: '', prop: 'projectCode', center: 'left' },
    { label: 'g', width: '100', prop: 'unit', center: 'left' },
    { label: 'h', width: '150', prop: 'explanation', center: 'left' },
    {
        label: 'i',
        prop: '',
        center: 'center',
        children: [
            {
                label: 'j',
                prop: 'lastyearExecution',
                width: '110',
                center: 'right',
            },
            {
                label: 'k',
                prop: 'halfyearExecution',
                width: '150',
                center: 'right',
            },
        ],
    },
    { label: 'l', width: '140', prop: 'deptOneUp', center: 'right' },
    { label: 's', width: '140', prop: 'committeeTowDown', center: 'right' },
    { label: 't', prop: 'reldeptTowDown', center: 'right' },
    { label: 'u', width: '100', prop: 'budgetTarget', center: 'left' },
    { label: 'v', width: '100', prop: 'creatorName', center: 'left' },
    { label: 'w', width: '100', prop: 'orgName', center: 'left' },
    { label: 'x', width: '100', prop: 'year', center: 'center' },
    { label: 'y', width: '100', prop: 'issued', center: 'center' },
])
</script>

<template>
    <VxeTable
        show-overflow
        height="1000"
        :data="data"
        :tree-config="{}"
        :scroll-y="{ enabled: true, gt: 20 }"
    >
        <VxeColumn
            type="seq"
            tree-node
        />
        <template v-for="item in tableHeader" :key="item.prop">
            <VxeColumn
                :field="item.prop"
                :title="item.label"
            />
        </template>
    </VxeTable>
</template>
