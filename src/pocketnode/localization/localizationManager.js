const FileSystem = require("fs");

class localizationManager {
    constructor(lang) {
        this.initVars();

        this.setLanguage(lang);
    }

    initVars() {
        this.languages = [];

        this.language = "en";
    }

    loadLanguages() {
        FileSystem.readdirSync(__dirname + "/languages/").forEach(file => {
            let fl = file.replace(".json", "");
            this.languages[fl] = JSON.parse(FileSystem.readFileSync(__dirname + "/languages/" + file).toString());
        });
    }

    setLanguage(lang) {
        this.language = lang;
    }

    getPhrase(phrase) {
        if (this.languages[this.language]["content"][phrase] !== null) {
            return this.languages[this.language]["content"][phrase];
        } else {
            return "MISSING " + this.language + " LANGUAGE PHRASE: " + phrase;
        }
    }

}

module.exports = localizationManager;