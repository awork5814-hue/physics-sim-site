#!/bin/bash
# Setup script to push physics-sim-site to GitHub

echo "Installing GitHub CLI..."
if ! command -v gh &> /dev/null; then
    # Try installing via apt
    if command -v apt &> /dev/null; then
        echo "Run: sudo apt update && sudo apt install gh"
    fi
fi

echo ""
echo "After installing gh, run these commands:"
echo ""
echo "1. Authenticate with GitHub:"
echo "   gh auth login"
echo ""
echo "2. Create a new repository on GitHub:"
echo "   gh repo create physics-sim-site --public"
echo ""
echo "3. Push to GitHub:"
echo "   cd /home/amr/physics-sim-site"
echo "   gh repo set-origin https://github.com/YOUR_USERNAME/physics-sim-site.git"
echo "   git push -u origin main"
echo ""
echo "Or simply:"
echo "   cd /home/amr/physics-sim-site"
echo "   git remote add origin https://github.com/awork5814-hue/physics-sim-site.git"
echo "   gh auth login"
echo "   git push -u origin main"
