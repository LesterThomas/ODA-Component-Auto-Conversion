
// create APIVersion object based on objectsArray[key].apiVersion and desiredAPIVersion
var apiVersion = new APIVersion(objectsArray[key].apiVersion, desiredAPIVersion);

objectsArray[key].metadata.annotations.webhookconverted = "Webhook converted From " + objectsArray[key].apiVersion + " to " + desiredAPIVersion;
console.log('Comparing old version ' + objectsArray[key].apiVersion + ' and desired version ' + desiredAPIVersion);

// if the oldAPIVersion is v1alpha3 or v1alpha4 and newVersion is v1alpha2 or v1alpha1 then convert dependentAPIs dependantAPIs
if (apiVersion.mapOldToNew(["v1alpha3", "v1alpha4"], ["v1alpha2", "v1alpha1"])) {
console.log("convert dependentAPIs to dependantAPIs")
if (objectsArray[key].spec.coreFunction.dependentAPIs) {
    objectsArray[key].spec.coreFunction.dependantAPIs = objectsArray[key].spec.coreFunction.dependentAPIs;
    delete objectsArray[key].spec.coreFunction.dependentAPIs
}
}

// if the oldAPIVersion is v1alpha2 or v1alpha1 and newVersion is v1alpha3 or v1alpha4 then convert dependantAPIs dependentAPIs
if (apiVersion.mapOldToNew(["v1alpha2", "v1alpha1"], ["v1alpha3", "v1alpha4"])) {
console.log("convert depandantAPIs to dependentAPIs")
if (objectsArray[key].spec.coreFunction.dependantAPIs) {
    objectsArray[key].spec.coreFunction.dependentAPIs = objectsArray[key].spec.coreFunction.dependantAPIs;
    delete objectsArray[key].spec.coreFunction.dependantAPIs
}
}

// if the oldAPIVersion is v1alpha1, v1alpha2, v1alpha3 or v1alpha4 and newVersion is v1beta1 then remove the componentKinds
// and add dependentAPIs to the management and security segments
if (apiVersion.mapOldToNew(["v1alpha1", "v1alpha2", "v1alpha3", "v1alpha4"], ["v1beta1"])) {
console.log("remove componentKinds")
if (objectsArray[key].spec.componentKinds) {
    delete objectsArray[key].spec.componentKinds
}

console.log("add dependentAPIs to management segment")
managementArray = objectsArray[key].spec.management
delete objectsArray[key].spec.management
objectsArray[key].spec.management = {dependentAPIs: []}
objectsArray[key].spec.management.exposedAPIs = managementArray

console.log("add dependentAPIs to security segment")
objectsArray[key].spec.security.dependentAPIs = []
objectsArray[key].spec.security.exposedAPIs = []

if (objectsArray[key].spec.security.partyrole) {
    console.log("move the partyrole to the exposedAPIs")
    // add the partyrole to the exposedAPIs
    objectsArray[key].spec.security.partyrole.name = "partyrole"
    objectsArray[key].spec.security.exposedAPIs.push(objectsArray[key].spec.security.partyrole)
    delete objectsArray[key].spec.security.partyrole
}
}

// if the oldAPIVersion is v1beta1 and newVersion is v1alpha1, v1alpha2, v1alpha3 or v1alpha4 then add the componentKinds
// and remove dependentAPIs from the management and security segments
if (apiVersion.mapOldToNew(["v1beta1"], ["v1alpha1", "v1alpha2", "v1alpha3", "v1alpha4"])) {
console.log("add componentKinds")
objectsArray[key].spec.componentKinds = []

console.log("remove dependentAPIs from management segment")
managementArray = objectsArray[key].spec.management.exposedAPIs
delete objectsArray[key].spec.management
objectsArray[key].spec.management = managementArray

// find the partyrole in the exposedAPIs and add it to the security
for (var i = 0; i < objectsArray[key].spec.security.exposedAPIs.length; i++) {
    if (objectsArray[key].spec.security.exposedAPIs[i].name === "partyrole") {
    console.log("move the partyrole from the exposedAPIs")
    objectsArray[key].spec.security.partyrole = objectsArray[key].spec.security.exposedAPIs[i]
    }
}
delete objectsArray[key].spec.security.exposedAPIs

console.log("remove dependentAPIs from security segment")
delete objectsArray[key].spec.security.dependentAPIs
}

objectsArray[key].apiVersion = desiredAPIVersion;
      
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
    