#!/bin/bash
g++ -fPIC -c -Wall ./lib/src/lib.c -o ./lib/out/libr.o

ld -shared ./lib/out/libr.o -o ./lib/out/libr.so
cp ./lib/src/lib.h ./ui/src/

g++ -Wall -L./lib/out -Wl,-rpath=./lib/out ./ui/src/main.c -lr

./a.out