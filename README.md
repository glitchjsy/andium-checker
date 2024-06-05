# Andium Properties Checker
A simple program that checks the Andium Homes [homes to rent](https://www.andiumhomes.je/findahome/propertylettings/) page for updates, then sends an email summary.

## Getting Started

1. Make sure Node.js and Git are installed
2. Clone the repo `git clone https://github.com/glitchjsy/andium-checker`
3. Run `cd andium-checker && npm install`
4. Create a free account at [Mailtrap](https://mailtrap.io), follow the steps to set up your account, including verifying your own domain, and retrieve your username and password.
5. Create a file named `config.json`. Here is the default config which you should modify to suit your own needs:

```json
{
    "cronInterval": "*/5 * * * *",
    "headers": {
        "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
    },
    "email": {
        "from": "andium@glitch.je",
        "recipients": [
            "luke@glitch.je",
            "example@gmail.com"
        ],
        "subject": "Andium Checker",
        "user": "MAILTRAP USERNAME",
        "pass": "MAILTRAP PASSWORD"
    }
}
```

## Example Email
```
----------------
New Properties: --
Name: 3A Victoria Cottage Homes – Over 55’s
Address: Victoria Cottage Homes, St Saviour's Hill, JE2 7TS, St. Saviour
Price: £910.00

----------------
Removed Properties:
--
Name: 3A Victoria Cottage Homes
Address: Victoria Cottage Homes, St Saviour's Hill, JE2 7TS, St. Saviour
Price: £910.00
```
