import Git from 'simple-git'

const git = Git()

const logs = await git.log({ maxCount: 200 })

console.log(logs, '----')
