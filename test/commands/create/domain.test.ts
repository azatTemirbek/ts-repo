import {expect, test} from '@oclif/test'

describe('create::domain', () => {
  test
  .stdout()
  .command(['create::domain'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['create::domain', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
