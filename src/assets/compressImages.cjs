const fs = require('fs');
const path = require('path');
const sharp = require('sharp'); // The standard image library

// ================= CONFIGURATION =================
const INPUT_DIR = __dirname;
const OUTPUT_DIR_NAME = 'optimized_1080h';

// Target Settings
const TARGET_HEIGHT = 1080;
const QUALITY = 75;

// Folders to IGNORE
const EXCLUDED_FOLDERS = ['original-res', 'backups', 'node_modules', '.git'];
// =================================================

const rootOutputDir = path.join(INPUT_DIR, OUTPUT_DIR_NAME);

// Recursive function to find files
function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function(file) {
        const fullPath = path.join(dirPath, file);
        
        // 1. Skip Output Folder
        if (fullPath.includes(OUTPUT_DIR_NAME)) return;

        // 2. Skip Excluded Folders
        if (EXCLUDED_FOLDERS.includes(file)) return;

        if (fs.statSync(fullPath).isDirectory()) {
            if (!file.startsWith('.')) {
                arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
            }
        } else {
            // Check extensions
            if (['.jpg', '.jpeg', '.png'].includes(path.extname(file).toLowerCase())) {
                arrayOfFiles.push(fullPath);
            }
        }
    });
    return arrayOfFiles;
}

// Main Async Function
async function processImages() {
    console.log(`Scanning for images in ${INPUT_DIR}...`);
    const files = getAllFiles(INPUT_DIR);

    console.log(`Found ${files.length} images. Starting Sharp processing...`);
    console.log('---------------------------------------------------------');

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < files.length; i++) {
        const filePath = files[i];
        
        try {
            // Create output path
            const relativePath = path.relative(INPUT_DIR, filePath);
            const relativeDir = path.dirname(relativePath);
            const targetDir = path.join(rootOutputDir, relativeDir);
            
            // Replaces .jpg/.png with .webp
            const fileNameNoExt = path.basename(filePath, path.extname(filePath));
            const outputFilePath = path.join(targetDir, `${fileNameNoExt}.webp`);

            if (!fs.existsSync(targetDir)){
                fs.mkdirSync(targetDir, { recursive: true });
            }

            // --- THE IMAGE MAGIC ---
            // 1. Load image
            const image = sharp(filePath);
            
            // 2. Get Metadata (to calculate width)
            const metadata = await image.metadata();
            
            // 3. Resize & Compress
            // Sharp handles 'auto' width if you only provide height
            await image
                .resize({ 
                    height: TARGET_HEIGHT, 
                    withoutEnlargement: false // scale up if smaller than 1080h? (false = don't scale up)
                }) 
                .webp({ 
                    quality: QUALITY, 
                    effort: 6, // Max compression effort (0-6)
                    smartSubsample: true // 4:2:0 subsampling
                })
                .toFile(outputFilePath);

            // Calculate width for logging
            const newWidth = Math.round(metadata.width * (TARGET_HEIGHT / metadata.height));
            
            console.log(`[${i + 1}/${files.length}] OK: ${relativePath} -> ${newWidth}x${TARGET_HEIGHT}`);
            successCount++;

        } catch (err) {
            console.error(`X ERROR on ${path.basename(filePath)}: ${err.message}`);
            errorCount++;
        }
    }

    console.log('---------------------------------------------------------');
    console.log(`Complete! Success: ${successCount} | Errors: ${errorCount}`);
}

processImages();