#!/bin/bash

ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
COMPILABLE_ROOT="$ROOT/tests/compilable"
COMPILED_ROOT="$ROOT/tests/compiled"

rm -rf $COMPILED_ROOT

(cd $COMPILABLE_ROOT ; find . -type f -print0 | sed 's|^\./||') | while IFS= read -r -d $'\0' file
do
    echo $file
    DIR="`dirname "$COMPILED_ROOT/$file"`"
    if [ ! -f "$DIR" ]
    then
        mkdir -p $DIR
    fi

    $ROOT/node_modules/.bin/babel --plugins transform-es3-properties $COMPILABLE_ROOT/$file > $COMPILED_ROOT/$file
done