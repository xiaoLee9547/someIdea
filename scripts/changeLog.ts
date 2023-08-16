import fs from 'node:fs'
import Git from 'simple-git'
import moment from 'moment'

const git = Git()

interface ChangeLogItem {
    message: string
    date: string
}
type CommitType = 'feat' | 'fix'

enum scopesName {
    'basic' = '基础服务',
    'budget' = '预算系统',
}

git.log({ maxCount: 200 }).then((logs) => {
    if (logs.latest.message === 'chore(chore): create CHANGELOG.md') return
    const filterLogs = logs.all.filter(commit => commit.message.startsWith('feat') || commit.message.startsWith('fix'))
    const changeMap: Map<string, {
        feat: ChangeLogItem[]
        fix: ChangeLogItem[]
    }> = new Map()
    filterLogs.forEach(async (item) => {
        const [prefix, suffix] = item.message.split(': ')
        const commitType: CommitType = prefix.split('(')[0] as CommitType
        const regex = /\(([^)]+)\)/
        const scope = prefix.match(regex) ? prefix.match(regex)[1] : ''
        const changeLogItem: ChangeLogItem & { commitType: CommitType } = {
            commitType,
            message: suffix,
            date: moment(item.date).format('YYYY-MM-DD'),
        }

        const mapScope = changeMap.get(scope)
            ? changeMap.get(scope)
            : {
                feat: [],
                fix: [],
            }
        changeLogItem.commitType === 'feat' ? mapScope.feat.push(changeLogItem) : mapScope.fix.push(changeLogItem)
        changeMap.set(scope, mapScope)

        // 将 changeMap 转换为 markdown
        let markdown = '# 更新日志\n'
        changeMap.forEach((value, key) => {
            markdown += `## ${scopesName[key] ? scopesName[key] : '其它'}\n`
            value.feat.forEach((item) => {
                markdown += `- (${item.date})新增: ${item.message} \n`
            })
            value.fix.forEach((item) => {
                markdown += `- (${item.date})修复: ${item.message} \n`
            })
        })
        console.log(markdown)
        fs.writeFileSync('./CHANGELOG.md', markdown)
        git.add('./CHANGELOG.md')
        git.commit('chore(chore): create CHANGELOG.md')
    })
})
