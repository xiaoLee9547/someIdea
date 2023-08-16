import fg from 'fast-glob'

const getPackages = packagePath => fg.sync('*', { cwd: packagePath, onlyDirectories: true })

const scopes = [
    ...getPackages('apps'),
    ...getPackages('packages'),
]

export default {
    rules: {
        /**
         * type[scope]: [function] description
         *      ^^^^^
         */
        'scope-enum': [2, 'always', scopes],
        /**
         * type[scope]: [function] description
         *
         * ^^^^^^^^^^^^^^ empty line.
         * - Something here
         */
        'body-leading-blank': [2, 'never'],
        /**
         * type[scope]: [function] description
         *
         * - something here
         *
         * ^^^^^^^^^^^^^^
         */
        'footer-leading-blank': [2, 'never'],
        /**
         * type[scope]: [function] description [No more than 72 characters]
         *      ^^^^^
         */
        'header-max-length': [2, 'always', 72],
        'scope-case': [2, 'always', 'lower-case'],
        'scope-empty': [2, 'never'],
        'subject-case': [
            1,
            'never',
            ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
        ],
        'subject-empty': [2, 'never'],
        'subject-full-stop': [2, 'never', '.'],
        'type-case': [2, 'always', 'lower-case'],
        'type-empty': [2, 'never'],
        /**
         * type[scope]: [function] description
         * ^^^^
         */
        'type-enum': [
            2,
            'always',
            [
                'build',
                'chore',
                'docs',
                'feat',
                'fix',
                'perf',
                'refactor',
                'revert',
                'release',
                'style',
                'test',
            ],
        ],
    },
}
