import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { convertVersion } from './convertVersion.js';

// for each folder in the TMForum-ODA-Component-Specification folder
let folders = fs.readdirSync('./TMForum-ODA-Component-Specification', { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

folders.forEach(folder => {
    console.log('')
    console.log('---------------------------------------------------')

    // for each file in the folder 
    let files = fs.readdirSync(path.join('./TMForum-ODA-Component-Specification', folder));
    let found = false
    files.forEach(file => {
        // if file name includes the substring 'Component-OAS-Specification-v1beta2'
        if (file.includes('Component-OAS-Specification-v1beta2.yaml')) {
            
            console.log("Processing " + file)
            found = true

            let fileContents = fs.readFileSync(path.join('./TMForum-ODA-Component-Specification', folder, file), 'utf8');
            
            // parse as a YAML document
            try {
                let doc = yaml.load(fileContents);
            

                // change the version of the component
                let convertedDoc = convertVersion(doc);

                // create new filename with no spaces
                let newFilename = convertedDoc.spec.type + "-v1beta2.yaml"

                // create new foldername with no spaces
                let newFolderName = convertedDoc.spec.type 

                // create new folder
                fs.mkdirSync(path.join('./OutputFiles', newFolderName), { recursive: true });

                // write doc as a yaml document to the OutputFiles folder
                fs.writeFileSync(path.join('./OutputFiles', newFolderName, newFilename), yaml.dump(convertedDoc));
                } catch (e) {
                    console.error("Exception processing " + file + ": " + e.message);
                }
            } 
    });
    if (!found) {
        console.log("No file found for " + folder)
    }
});


