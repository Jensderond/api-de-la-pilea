const mocha = require('mocha');
const it = mocha.it;
const describe = mocha.describe;
const assert = require('assert');
const User = require('../../model/user.model');

describe('Creating users in the database', () => {
    'use strict';

    it('Saves a user', (done) => {
        let pieter = new User( {
            name: 'Pieter',
            email: 'pieter@gmail.com',
            password: 'password123',
            admin: false,
            age: 20
        });

        pieter.save()
            .then(() => {
                assert(!pieter.isNew);
                done();
            });
    });
});