import Git from 'simple-git'

const git = Git({
    maxConcurrentProcesses: 200,
})

interface CommitInfo {
    functions: string[]
    version?: string
    hash: string
    date: string
    message: string
    refs?: string
    body?: string
    author_name: string
    author_email: string
}

let cache: CommitInfo[] | undefined

const getChangeLog = async (count: 200) => {
    if (cache)
        return cache

    const logs = (await git.log({ maxCount: count })).all.filter(i =>
        i.message.includes('chore: release')
        || i.message.includes('!')
        || i.message.startsWith('feat')
        || i.message.startsWith('fix'),
    ) as CommitInfo[]

    for (const log of logs) {
        if (log.message.includes('chore: release')) {
            log.version = log.message.split(' ')[2].trim()
            continue
        }
        const raw = await git.raw(['diff-tree', '--no-commit-id', '--name-only', '-r', log.hash])
        console.log(raw)
        delete log.body
        const files = raw.replace(/\\/g, '/').trim().split('\n')
        console.log(files)
        function uniq<T extends any[]>(a: T) {
            return Array.from(new Set(a))
        }
        log.functions = uniq(
            files
                .map(i => i.match(/^packages\/\w+\/(\w+)\/\w+?\.ts$/)?.[1])
                .filter(Boolean),
        )
    }

    const result = logs.filter(i => i.functions?.length || i.version)
    cache = result
    return result
}

export { getChangeLog }
