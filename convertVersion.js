// create javascript module with function convertVersion 

function convertVersion(yamlObject) {

    // Move coreFunction, security and management segments into the spec
    process.stdout.write("Move coreFunction, security (or securityFunction) and management (or managementFunction) segments into the spec: ")
    let segmentList = ["coreFunction", "security", "management", "securityFunction", "managementFunction"]
    let count = 0
    for (const propertyKey of segmentList) {
        if (yamlObject[propertyKey]) {
            yamlObject.spec[propertyKey] = yamlObject[propertyKey]
            delete yamlObject[propertyKey]
            count++
        }   
    }
    logSuccess(count + " segments moved")

    // Rename security and management segments to securityFunction and managementFunction
    process.stdout.write("Rename security and management segments to securityFunction and managementFunction: ")
    count = 0
    for (const propertyKey of segmentList) {
        if (yamlObject.spec[propertyKey]) {
            if (propertyKey == "security") {
                yamlObject.spec.securityFunction = yamlObject.spec[propertyKey]
                delete yamlObject.spec[propertyKey]
                count++
            }
            if (propertyKey == "management") {
                yamlObject.spec.managementFunction = yamlObject.spec[propertyKey]
                delete yamlObject.spec[propertyKey]
                count++
            }
        }
    }
    logSuccess(count + " segments renamed")

    segmentList = ["coreFunction", "securityFunction", "managementFunction"]

    // Convert isRequired: yes/no to required: true/false for any API in exposedAPIs property of coreFunction, security and management segments
    process.stdout.write("Convert isRequired: yes/no to required: true/false for any API in exposedAPIs property of coreFunction, security and management segments: ")
    count = 0
    for (const propertyKey of segmentList) {
        if (yamlObject.spec[propertyKey].exposedAPIs) {
            for (var exposedAPI of yamlObject.spec[propertyKey].exposedAPIs) {
                if (exposedAPI.isRequired) {
                    // convert 'yes' or 'no' to true or false
                    exposedAPI.required = exposedAPI.isRequired == 'yes' ? true : false;
                    delete exposedAPI.isRequired;
                    count++
                }
            }
        }
    }
    logSuccess(count + " isRequired converted")

    // Convert dependantAPIs to dependentAPIs in coreFunction, security and management segments
    process.stdout.write("Convert dependantAPIs to dependentAPIs in coreFunction, security and management segments: ")
    count = 0
    for (const propertyKey of segmentList) {
        if (yamlObject.spec[propertyKey].dependantAPIs) {
            yamlObject.spec[propertyKey].dependentAPIs = yamlObject.spec[propertyKey].dependantAPIs
            delete yamlObject.spec[propertyKey].dependantAPIs
            count++
        }
    }
    logSuccess(count + " dependantAPIs converted")

    // Convert isRequired: yes/no to required: true/false for any API in dependentAPIs property of coreFunction, security and management segments: 
    process.stdout.write("Convert isRequired: yes/no to required: true/false for any API in dependentAPIs property of coreFunction, security and management segments: ")
    count = 0
    for (const propertyKey of segmentList) {
        if (yamlObject.spec[propertyKey].dependentAPIs) {
            for (var dependentAPIs of yamlObject.spec[propertyKey].dependentAPIs) {
                if (dependentAPIs.isRequired) {
                    // convert 'yes' or 'no' to true or false
                    dependentAPIs.required = dependentAPIs.isRequired == 'yes' ? true : false
                    delete dependentAPIs.isRequired
                    count++
                }
            }
        }
    }
    logSuccess(count + " isRequired converted")

    // Rename to remove component from property names
    rename(yamlObject.spec, "componentFunctionalBlock", "functionalBlock")
    rename(yamlObject.spec, "componentPublicationDate", "publicationDate")
    rename(yamlObject.spec, "componentStatus", "status")
    rename(yamlObject.spec, "componentVersion", "version")
    rename(yamlObject.spec, "componenentDescription", "description")

    // recreate type from ID and name
    process.stdout.write("Create type from componentId and componentName: ")
    if (yamlObject.spec.componentId && yamlObject.spec.componentName) {
        yamlObject.spec.type = yamlObject.spec.componentId + "-" + yamlObject.spec.componentName
        delete yamlObject.spec.componentId
        delete yamlObject.spec.componentName
        logSuccess("OK")
    } else {
        logWarn("Not found")
    }

    // remove reporting
    process.stdout.write("Remove reporting: ")
    if (yamlObject.reporting) {
        delete yamlObject.reporting
        logSuccess("OK")
    } else {
        logWarn("Not found")
    }


    return yamlObject;
}

function rename(object, oldName, newName) {
    process.stdout.write("Rename " + oldName + " to " + newName + ": ")
    if (object[oldName]) {
        object[newName] = object[oldName];
        delete object[oldName];
        logSuccess("OK")
    } else {
        logWarn("Not found")
    }
}

function logSuccess(message) {
    console.log("\x1b[32m " + message + "\x1b[0m")
}

function logWarn(message) {
    console.log("\x1b[33m " + message + "\x1b[0m")
}

export { convertVersion };