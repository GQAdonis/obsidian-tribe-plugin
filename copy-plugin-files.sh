#!/bin/bash

# Define source and destination directories
SRC_DIR="dist"
DEST_DIR="test-vault/.obsidian/plugins/obsidian-tribe-plugin"

# Create destination directory if it doesn't exist
mkdir -p "$DEST_DIR"

# Copy main.js and its map file to the plugin directory
cp "$SRC_DIR/main.js" "$DEST_DIR/main.js"
cp "$SRC_DIR/main.js.map" "$DEST_DIR/main.js.map"

# Copy styles.css to the plugin directory
cp "$SRC_DIR/styles.css" "$DEST_DIR/styles.css"

# Copy manifest.json to the plugin directory
cp manifest.json "$DEST_DIR"

echo "Main plugin files copied successfully!"
