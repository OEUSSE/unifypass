#!/usr/bin/env node

'use strict'

const minimist = require('minimist')
const { createDb } = require('./lib/db')

const argv = minimist(process.argv.slice(2))

async function main () {
    const db = await createDb()
    const command = argv._.shift()

    switch (command) {
        case 'users:create':
            try {
                const { user, pass } = argv
                await db.createUser(user, pass)
                console.log(`User ${user} created`)
            } catch (error) {
                throw new Error('Cannot create user')
            }
            break

        case 'users:list':
            try {
                const results = await db.listUsers()
                if (!results.count || !results.users.length) console.log('No users found')

                results.users.forEach(({ user }) => {
                    console.log(` - ${user}`)
                })
                console.log(`Total: ${results.count}`)
            } catch (error) {
                throw new Error('Cannot list users')
            }
            break

        case 'secrets:create':
            break

        case 'secrets:list':
            break

        default:
            console.error(`Command not found ${command}`)
    }
}

main().catch(err => console.error(err))
