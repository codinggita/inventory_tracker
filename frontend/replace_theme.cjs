const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css')) { 
            results.push(file);
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'src'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Replace theme colors
    content = content.replace(/blue-/g, 'emerald-');
    content = content.replace(/indigo-/g, 'teal-');
    content = content.replace(/INVENTRACK/g, 'Shelf Scout');
    content = content.replace(/Inventrack/g, 'Shelf Scout');
    
    // Additional tweaks for specific image alignment
    // "Real-time Inventory Visibility" -> "Real-time inventory intelligence"
    content = content.replace(/Real-time Inventory Visibility/g, 'Real-time inventory intelligence');
    
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated: ${file}`);
    }
});
