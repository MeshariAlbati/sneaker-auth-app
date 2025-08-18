#!/bin/bash

# Fix Railway Configuration Conflicts

echo "🔧 Fixing Railway configuration conflicts..."

# Check if railway.yaml exists and may cause conflicts
if [ -f "railway.yaml" ]; then
    echo "⚠️  Found railway.yaml which may conflict with railway.toml"
    echo "📋 Current railway.yaml contents:"
    head -10 railway.yaml
    
    echo ""
    echo "🚨 This file may cause deployment issues!"
    echo "💡 railway.toml is the primary configuration file"
    echo "💡 railway.yaml is optional and can cause conflicts"
    
    echo ""
    read -p "❓ Do you want to remove railway.yaml to avoid conflicts? (y/n): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🗑️  Removing railway.yaml..."
        rm railway.yaml
        echo "✅ railway.yaml removed successfully!"
        echo "💡 Now using only railway.toml for configuration"
    else
        echo "⚠️  Keeping railway.yaml - this may cause deployment issues"
        echo "💡 You can manually remove it later if needed"
    fi
else
    echo "✅ No railway.yaml found - configuration is clean!"
fi

echo ""
echo "🔍 Current Railway configuration files:"
ls -la railway.*

echo ""
echo "📋 railway.toml contents:"
cat railway.toml

echo ""
echo "🎯 Next steps:"
echo "1. Run: ./deploy_railway.sh"
echo "2. Or manually: railway up"
echo "3. Monitor with: railway logs --tail 50"
echo ""
echo "💡 This should fix the 'service unavailable' errors!"
