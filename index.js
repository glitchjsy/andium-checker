const fetch = require("node-fetch");
const cron = require("node-cron");
const cheerio = require("cheerio");
const chalk = require("chalk");
const nodemailer = require("nodemailer");
const config = require("./config.json");

const transporter = nodemailer.createTransport({
    host: 'live.smtp.mailtrap.io',
    port: 587,
    secure: false,
    auth: {
        user: config.email.user,
        pass: config.email.pass,
    }
});

const url = "https://www.andiumhomes.je/findahome/propertylettings/";

let existingProperties = [];

/**
 * Scrapes properties on the Andium website and checks for changes.
 */
async function checkProperties() {
    try {
        console.log(chalk.gray("Checking properties..."));

        const response = await fetch(url, config.headers);
        const html = await response.text();
        const $ = cheerio.load(html);

        const properties = [];

        // Loop over properties list
        $("#lettingsList .container.p-0").each((i, element) => {
            const property = {};

            property.name = $(element).find("h3").text().trim();
            property.address = $(element).find("p.mb-1").text().trim();
            property.price = $(element).find("span.h3").text().trim();

            properties.push(property);
        });

        // Find any differences between the cached properties and newly fetched properties
        const changes = findArrayDifference(existingProperties, properties);

        if (changes.added.length === 0 && changes.removed.length === 0) {
            console.log(chalk.yellow("No changes"));
            return;
        }

        console.log(chalk.gray(`Found ${changes.added.length} new and ${changes.removed.length} removed properties`));

        let message = "";

        // If new properties were added, format a message to email
        if (changes.added.length !== 0) {
            message += "<br><br>----------------<br>";
            message += "<strong>New Properties:</strong><br>";

            for (let change of changes.added) {
                message += "--<br>";
                message += "Name: " + change.name + "<br>";
                message += "Address: " + change.address + "<br>";
                message += "Price: " + change.price + "<br>";
            }
            message += "<br>";
        }

        // If properties were removed, format a message to email
        if (changes.removed.length !== 0) {
            message += "<br><br>----------------<br>";
            message += "<strong>Removed Properties:</strong><br>";

            for (let change of changes.removed) {
                message += "--<br>";
                message += "Name: " + change.name + "<br>";
                message += "Address: " + change.address + "<br>";
                message += "Price: " + change.price + "<br>";
            }
            message += "<br>";
        }

        sendUpdate(message);
        existingProperties = properties;
    } catch (e) {
        console.error(chalk.red("Failed to check"), e);
    }
}

/**
 * Sends an email containing the given html.
 * 
 * @param {String} html The html content of the email
 */
async function sendUpdate(html) {
    const mailOptions = {
        from: config.email.from,
        to: config.email.recipients,
        subject: `${config.email.subject} (${generateRandomString(6)})`,
        html
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(chalk.red("Failed to send update"), e);
        } else {
            console.log(chalk.green('Email sent:', info.response));
        }
    });
}

/**
 * Finds the differences between the two arrays.
 * 
 * @param {Array} existingProperties The existing cached properties
 * @param {Array} properties The newly fetched properties
 * @returns The properties that were added or removed
 */
function findArrayDifference(existingProperties, properties) {
    const existingNames = existingProperties.map(p => p.name);
    const newNames = properties.map(p => p.name);

    return {
        added: properties.filter(p => !existingNames.includes(p.name)),
        removed: existingProperties.filter(p => !newNames.includes(p.name))
    }
}

/**
 * Generates a random string of characters.
 * https://stackoverflow.com/a/1349426
 * 
 * @param {Number} length The length of the random string
 * @returns A random string
 */
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

checkProperties();

cron.schedule(config.cronInterval, function () {
    checkProperties();
});