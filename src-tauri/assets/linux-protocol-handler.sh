#!/bin/bash

# Get the directory of the installed application
APP_DIR="$(dirname "$(readlink -f "$0")")"
APP_PATH="$APP_DIR/dominara"  # Path to the dominara executable

# Create desktop file
cat > ~/.local/share/applications/dominara-handler.desktop << EOL
[Desktop Entry]
Type=Application
Name=Dominara
Exec=$APP_PATH %u
Terminal=false
NoDisplay=true
MimeType=x-scheme-handler/dominara;
EOL

# Register protocol handler
xdg-mime default dominara-handler.desktop x-scheme-handler/dominara

echo "Dominara protocol handler has been registered" 