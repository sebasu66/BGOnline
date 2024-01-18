#!/bin/bash

# Remove the report file if it already exists
if [ -f report.txt ]; then
    rm report.txt
fi

# Find all .js, .html, and .css files in the current directory and its subdirectories
for file in $(find . -name "*.js" -o -name "*.html" -o -name "*.css"); do
    # Print the file name to the report file
    echo "File: $file" >> report.txt
    echo "" >> report.txt

    # Append the file contents to the report file
    cat $file >> report.txt
    echo "" >> report.txt
    echo "--------------------------------------------------" >> report.txt
    echo "" >> report.txt
done