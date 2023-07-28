// create javascript module with function convertVersion 

function convertVersion(yamlObject, desiredAPIVersion) {

    // create APIVersion object based on objectsArray[key].apiVersion and desiredAPIVersion
    var apiVersion = new APIVersion(yamlObject.apiVersion, desiredAPIVersion);

    // if the oldAPIVersion is v1alpha3 or v1alpha4 and newVersion is v1alpha2 or v1alpha1 then convert dependentAPIs dependantAPIs
    if (apiVersion.mapOldToNew(["v1beta2"], ["v1beta1"])) {
        console.log("convert isRequired: yes/no to required: true/false for any API in exposedAPIs property of coreFunction, security and management segments")
        
        const segmentList = ["coreFunction", "security", "management"];
        for (const propertyKey of segmentList) {
            if (yamlObject[propertyKey].exposedAPIs) {
                for (var exposedAPI of yamlObject[propertyKey].exposedAPIs) {
                    if (exposedAPI.isRequired) {
                        // convert 'yes' or 'no' to true or false
                        exposedAPI.required = exposedAPI.isRequired == 'yes' ? true : false;
                        delete exposedAPI.isRequired;
                    }
                }
            }
        }

        console.log("convert dependantAPIs to dependentAPIs")
        if (yamlObject.coreFunction.dependantAPIs) {
            yamlObject.coreFunction.dependentAPIs = yamlObject.coreFunction.dependantAPIs;
            delete yamlObject.coreFunction.dependantAPIs
        }

        console.log("convert isRequired: yes/no to required: true/false for any API in dependentAPIs property of coreFunction, security and management segments")
        
        for (const propertyKey of segmentList) {
            if (yamlObject[propertyKey].dependentAPIs) {
                for (var exposedAPI of yamlObject[propertyKey].dependentAPIs) {
                    if (exposedAPI.isRequired) {
                        // convert 'yes' or 'no' to true or false
                        exposedAPI.required = exposedAPI.isRequired == 'yes' ? true : false;
                        delete exposedAPI.isRequired;
                    }
                }
            }
        }
    

    }
    yamlObject.converted=desiredAPIVersion;
    return yamlObject;
}


// Class to capture the old and new API versions
class APIVersion {
    constructor(oldAPIVersion, newAPIVersion) {
    this.oldAPIVersion = oldAPIVersion.split('/')[1]; // only use the version part of the API version i.e. remove ''
    this.newAPIVersion = newAPIVersion.split('/')[1];
    }

    // test if array of oldAPIVersions contains the oldAPIVersion and array of newAPIVersions contains the newAPIVersion
    mapOldToNew(oldAPIVersionList, newAPIVersionList) {
    if (oldAPIVersionList.includes(this.oldAPIVersion) && newAPIVersionList.includes(this.newAPIVersion)) {
        return true;
    } else {
        return false;
    }
    }
} 

export { convertVersion };