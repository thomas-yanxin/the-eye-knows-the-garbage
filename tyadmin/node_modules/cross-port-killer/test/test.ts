import { spawn } from 'child_process'
import * as expect from 'expect.js'
import psList from 'ps-list'
import { Killer } from '../source/port-killer'

describe('Assassin', () => {
    it('should terminate process running on a given port', done => {
        const server = spawn('node', [require.resolve('http-server/bin/http-server'), '-p', '7070'], {
            stdio: 'ignore',
            detached: true
        })

        server.unref()

        const instance = new Killer(process.platform)

        const loop = (limit = 50) => {
            instance
                .kill(7070)
                .then(pid => expect(server.pid.toString()).to.be(pid.pop()) && psList())
                .then(data => {
                    for (let { pid } of data) expect(pid).not.to.be(server.pid)
                })
                .then(done)
                .catch(() => (limit > 0 ? loop(--limit) : null))
        }

        setTimeout(loop, 500)
    })
})
