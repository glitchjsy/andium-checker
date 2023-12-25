# Andium Properties Checker
A simple program that checks the Andium Homes [homes to rent](https://www.andiumhomes.je/findahome/propertylettings/) page for updates, then sends an email summary.

## Getting Started
1. Make sure Node.js and Git are installed
2. Clone the repo `git clone https://github.com/glitchjsy/andium-checker`
3. Run `cd andium-checker && npm install`
4. Create a free account at [Mailersend](https://www.mailersend.com), follow the steps to set up your account and retrieve your API key
5. Create a file named `config.json`. Here is the default config which you should modify to suit your own needs:

```json
{
    "cronInterval": "*/30 * * * *",
    "headers": {
        "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
    },
    "email": {
        "from": {
            "email": "andium-notifications@glitch.je",
            "name": "Luke's Andium Notifications"
        },
        "recipients": [
            {
                "email": "luke@glitch.je",
                "name": "Luke"
            }
        ],
        "subject": "Luke's Andium Checker",
        "apiKey": "mailersend api key"
    }
}
```