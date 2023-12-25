function findArrayDifference(existingProperties, properties) {
    const added = [];
    const removed = [];

    // Find added items
    properties.forEach(prop => {
        const found = existingProperties.find(existingProp => existingProp.name === prop.name);
        if (!found) {
            added.push(prop);
        }
    });

    // Find removed items
    existingProperties.forEach(existingProp => {
        const found = properties.find(prop => prop.name === existingProp.name);
        if (!found) {
            removed.push(existingProp);
        }
    });

    return { added, removed };
}

// https://stackoverflow.com/a/1349426
function generateRandomString(length) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;

    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

module.exports = { findArrayDifference, generateRandomString };