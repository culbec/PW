#!/bin/bash

for i in $(seq -f "%g" 1 32); do
  if [ $(ls *.png | wc -l) -lt $i ]; then
    break
  fi
  new_name="img${i}.png"
  old_name=$(ls *.png | head -n $i | tail -n 1)
  mv "$old_name" "$new_name"
done
