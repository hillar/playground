#!/bin/bash
conf=${1:-config.js}
port=$(node test.js -c ${conf} -T | grep -v 2018 | grep -v 'config dump'| grep . | sed 's/module.exports =  //' | jq .port)
node test.js -c ${conf} 1> acces.log 2>error.log &
pid=$!
sleep 1
#echo 'making request...'
hello=$(curl -s -u anonymous:anonymous localhost:${port}/whatever | grep 'Hello'| wc -l)
#echo "got ${hello}"
[ ${hello} -eq 1 ] || echo 'failed'
[ ${hello} -eq 1 ] && echo 'works ;)'
sleep 1
kill ${pid}
