import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import TranslateService from 'sl-ember-translate/services/sl-translate';
import { requires } from '../../helpers/sl/synchronous';

let TS;

moduleFor( 'service:sl-translate', 'Unit | Service | sl translate', {
    beforeEach() {
        TS = TranslateService.create();
    },

    unit: true
});

test( 'dictionary property defaults to null', function( assert ) {
    assert.strictEqual(
        TS.get( 'dictionary' ),
        null
    );
});

test( 'setDictionary() accepts only an object as a parameter', function( assert ) {
    const testProperty = Ember.Object.create({
        parameter: ''
    });

    const callSetDictionary = () => TS.setDictionary( testProperty.parameter );

    // Undefined
    testProperty.set( 'parameter', undefined );

    assert.throws(
        callSetDictionary,
        'Parameter was undefined'
    );

    // Array
    testProperty.set( 'parameter', [] );

    assert.throws(
        callSetDictionary,
        'Parameter was an array'
    );

    // Null
    testProperty.set( 'parameter', null );

    assert.throws(
        callSetDictionary,
        'Parameter was null'
    );

    // Number
    testProperty.set( 'parameter', 123 );

    assert.throws(
        callSetDictionary,
        'Parameter was a number'
    );

    // Function
    testProperty.set( 'parameter', function() {} );

    assert.throws(
        callSetDictionary,
        'Parameter was a function'
    );

    // String
    testProperty.set( 'parameter', 'testString' );

    assert.throws(
        callSetDictionary,
        'Parameter was a string'
    );

    // Boolean
    testProperty.set( 'parameter', false );

    assert.throws(
        callSetDictionary,
        'Parameter was false'
    );

    // Object
    testProperty.set( 'parameter', {} );

    assert.strictEqual(
        callSetDictionary(),
        undefined,
        'Parameter was an object'
    );

    // Ember.Object instance
    testProperty.set( 'parameter', Ember.Object.create( {} ) );

    assert.strictEqual(
        callSetDictionary(),
        undefined,
        'Parameter was an Ember.Object instance'
    );
});

test( 'setDictionary() sets data on the dictionary property', function( assert ) {
    const testDictionary = Ember.Object.create({
        'the_key': 'my value'
    });

    TS.setDictionary( testDictionary );

    assert.deepEqual(
        TS.get( 'dictionary' ),
        testDictionary
    );
});

test( 'getKeyValue() returns requested key if not found in dictionary', function( assert ) {
    TS.setDictionary( Ember.Object.create({
        'the_key': 'my value'
    }) );

    assert.notEqual(
        TS.getKeyValue( 'wrong_key' ),
        'the_key'
    );
});

test( 'getKeyValue() returns requested key\'s translated string', function( assert ) {
    TS.setDictionary( Ember.Object.create({
        'the_key': 'my value'
    }) );

    assert.strictEqual(
        TS.getKeyValue( 'the_key' ),
        'my value'
    );
});

test( 'translateKey() accepts only an object as a parameter', function( assert ) {
    const testDefinition = requires(
        TS.translateKey,
        [ 'object' ]
    );

    assert.ok(
        testDefinition.requires,
        testDefinition.messages
    );
});

test( 'translateKey() returns translated string for specified key', function( assert ) {
    TS.setDictionary( Ember.Object.create({
        'the_key': 'my value'
    }) );

    assert.strictEqual(
        TS.getKeyValue( 'the_key' ),
        'my value'
    );
});

test( 'If either "pluralKey" or "pluralCount" are provided to translateKey() then both must be', function( assert ) {
    assert.strictEqual(
        TS.translateKey({
            key: 'singular_key',
            pluralKey: 'plural_key'
        }),
        'singular_key'
    );

    assert.strictEqual(
        TS.translateKey({
            key: 'singular_key',
            pluralCount: 3
        }),
        'singular_key'
    );
});

test( 'Pluralization only works if "pluralCount" is a number', function( assert ) {
    TS.setDictionary( Ember.Object.create({
        'the_singular_key': 'Singular translated value',
        'the_plural_key': 'Plural translated value'
    }) );

    assert.notEqual(
        TS.translateKey({
            key: 'the_singular_key',
            pluralKey: 'the_plural_key',
            pluralCount: 'two'
        }),
        'Plural translated value'
    );
});

test( 'Pluralization occurs when provided the necessary information', function( assert ) {
    TS.setDictionary( Ember.Object.create({
        'the_singular_key': 'Singular translated value',
        'the_plural_key': 'Plural translated value'
    }) );

    assert.strictEqual(
        TS.translateKey({
            key: 'the_singular_key',
            pluralKey: 'the_plural_key',
            pluralCount: 0
        }),
        'Singular translated value'
        );

    assert.strictEqual(
        TS.translateKey({
            key: 'the_singular_key',
            pluralKey: 'the_plural_key',
            pluralCount: 3
        }),
        'Plural translated value'
    );
});

test( 'Token replacement in translation string', function( assert ) {
    TS.setDictionary( Ember.Object.create({
        'the_key': 'Replaced values: {0} and {1}'
    }) );

    assert.strictEqual(
        TS.translateKey({
            key: 'the_key',
            parameters: {
                $0: 'ASDF',
                $1: 1234
            }
        }),
        'Replaced values: ASDF and 1234'
    );
});
