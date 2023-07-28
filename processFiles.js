import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { convertVersion } from './convertVersion.js';

// for each file in the FilesForConversion folder
let files = fs.readdirSync('./FilesForConversion');
files.forEach(file => {
    // read the file
    let fileContents = fs.readFileSync(path.join('./FilesForConversion', file), 'utf8');

    // parse as a YAML document
    let doc = yaml.load(fileContents);

    // change the version of the component
    let convertedDoc = convertVersion(doc, "oda.tmforum.org/v1beta1");

    // write doc as a yaml document to the OutputFiles folder
    fs.writeFileSync(path.join('./OutputFiles', file), yaml.dump(convertedDoc));
});


