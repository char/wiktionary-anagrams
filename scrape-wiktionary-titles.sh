#!/usr/bin/env bash

curl "https://dumps.wikimedia.org/enwiktionary/latest/enwiktionary-latest-all-titles.gz" | gunzip -c | awk '{ if ($1 == "0") print $2 }' > static/words-all.txt

function split_file() {
  while read line
  do
    echo "$line" >> "static/words-by-length/${#line}.txt"
  done
}

cat static/words-all.txt | split_file
