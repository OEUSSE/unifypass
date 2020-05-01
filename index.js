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
            try {
                const { user, name, value } = argv
                await db.createSecret(user, name, value)
                console.log(`Secret ${name} created`)
            } catch (error) {
                throw new Error('Cannot create secret')
            }
            break

        case 'secrets:list':
            try {
                const { user } = argv
                const results = await db.listSecrets(user)
                
                results.secrets.forEach(({ name }) => {
                    console.log(` - ${name}`)
                })
                console.log(`Total: ${results.count}`)
            } catch (error) {
                throw new Error('Cannot list secrets')
            }
            break

        case 'secrets:get':
            try {
                const { user, name } = argv
                const secret = await db.getSecret(user, name)
                console.log(`Secret ${secret.name} con valor ${secret.value}`)
            } catch (error) {
                throw new Error('Cannot get secret')
            }
            break;

        case 'secrets:update':
            try {
                const { user, name, value } = argv
                await db.updateSecret(user, name, value)
                console.log(`Secret ${name} updated`)
            } catch (error) {
                console.log(error)
                throw new Error('Cannot update secret')
            }
            break;

        case 'secrets:delete':
            try {
                const { user, name } = argv
                await db.deleteSecret(user, name)
                console.log(`Secret ${name} deleted`)
            } catch (error) {
                console.log(error)
                throw new Error('Cannot delete secret')
            }
            break;

        default:
            console.error(`Command not found ${command}`)
    }
}

main().catch(err => console.error(err))
