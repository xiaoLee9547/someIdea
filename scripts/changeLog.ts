import Git from 'simple-git'

const git = Git()

const logs = git.log({ maxCount: 200 })

console.log(logs)
export {
    logs,
}
