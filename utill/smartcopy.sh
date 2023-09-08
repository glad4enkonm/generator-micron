#!/bin/bash

# Check that two arguments were provided
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <origin_path> <destination_path>"
    exit 1
fi

# Iterate over all SQL files in the origin directory
for f in "$1"/*.sql; do
    # Split the filename into prefix and name
    prefix=$(basename "$f" | cut -d'_' -f1)
    name=$(basename "$f" | cut -d'_' -f2-)
    name_with_number=$(basename "$f")
    # Find the corresponding file in the destination directory
    dest_file=$(find "$2" -name "*_$name")
    dest_file_name=$(basename "$dest_file")
    # If a matching file was found, copy the content of the origin file to the destination file
    if [ -n "$dest_file" ]; then
        echo "$name_with_number -> $dest_file_name"
        cp "$f" "$dest_file"
    fi
done
