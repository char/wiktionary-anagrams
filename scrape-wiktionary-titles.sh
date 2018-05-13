#!/usr/bin/env bash

curl "https://dumps.wikimedia.org/enwiktionary/latest/enwiktionary-latest-all-titles.gz" | gunzip -c | awk '{ if ($1 == "0") print $2 }' > .cache/words-all.txt
