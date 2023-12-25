const fetch = require("node-fetch");
const cron = require("node-cron");
const cheerio = require("cheerio");
const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");
const utils = require("./utils");
const config = require("./config.json");

const mailerSend = new MailerSend({
    apiKey: config.email.apiKey
});

const url = "https://www.andiumhomes.je/findahome/propertylettings/";

let existingProperties = [];

async function checkProperties() {
    try {
        const response = await fetch(url, config.headers);
        const html = await response.text();
        const $ = cheerio.load(html);

        const properties = [];

        $("#lettingsList .container.p-0").each((index, element) => {
            const property = {};

            property.name = $(element).find("h3").text().trim();
            property.address = $(element).find("p.mb-1").text().trim();
            property.price = $(element).find("span.h3").text().trim();

            properties.push(property);
        });

        const changes = utils.findArrayDifference(existingProperties, properties);

        if (changes.added.length === 0 && changes.removed.length === 0) {
            console.log("No changes");
            return;
        }

        let message = "";

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
        console.error("Failed to check", e);
    }
}

async function sendUpdate(html) {
    const sentFrom = new Sender(config.email.from.email, config.email.from.name);
    const recipients = config.email.recipients.map(recipient => new Recipient(recipient.email, recipient.name));

    const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setReplyTo(sentFrom)
        // Generate a random string so the emails dont get grouped together
        .setSubject(`${config.email.subject} (${utils.generateRandomString(6)})`)
        .setHtml(html);

    try {
        await mailerSend.email.send(emailParams);
    } catch (e) {
        console.error("Failed to send update", e);
    }

    const now = new Date();
    const nowString = `${now.getDay()}/${now.getMonth()}/${now.getFullYear()} at ${now.getHours()}:${now.getMinutes()}`;

    console.log(`Updated: ${nowString}`);
}

checkProperties();

cron.schedule(config.cronInterval, function () {
    checkProperties();
});