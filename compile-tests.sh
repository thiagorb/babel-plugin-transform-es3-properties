#!/bin/bash

ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SPECIFICATION_ROOT="$ROOT/tests/specification"
COMPILED_ROOT="$ROOT/tests/compiled"

rm -rf $COMPILED_ROOT

$ROOT/node_modules/.bin/babel --plugins transform-es3-properties --out-dir $COMPILED_ROOT $SPECIFICATION_ROOT > /dev/null