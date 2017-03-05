#!/usr/bin/env bash

echo -n 'Running specification tests'
if ! (
    TEST_MODULES_ROOT=specification ./node_modules/.bin/mocha -u tdd tests/test.js
)
then
    echo Specification tests failed
    exit 1
fi

echo -n 'Compiling tests... '
if ! ./compile-tests.sh
then
    echo 'Compiling tests failed'
    exit 1
else
    echo 'OK'
    echo
fi

echo -n 'Running compiled tests'
TEST_MODULES_ROOT=compiled ./node_modules/.bin/mocha -u tdd tests/test.js