/* global process */

const fs = require('fs');

class init {
    constructor() {

    }

    realInitProjectStructure() {
        console.log( "ionic-build-actions : Init" );

        const pathRootDir = './ionic-build-actions';
        const pathConfFile = './ionic-build-actions/actions.json';

        const pathConfFileTemplateObj = [
            {
                "name" : "test1",
                "group" : "test",
                "file" : "buildAction_test.js"
            },
            {
                "name" : "test2",
                "group" : "test",
                "file" : "buildAction_test_fake.js"
            }
        ];
        const pathConfFileTemplateString = JSON.stringify(pathConfFileTemplateObj, null, "\t");

        /** We're not going to be reccursive here, in order to have better control of each step */
        try {
            if (!fs.existsSync(pathRootDir)) {
                fs.mkdirSync(pathRootDir);
            }
        } catch(err) {
            console.error(err);
            process.exit(1);
        }

        try {
            if (!fs.existsSync(pathConfFile)) {
                fs.writeFileSync(pathConfFile, pathConfFileTemplateString, { flag: 'w' }, function (err) {
                    if (err) throw err;
                });
            }
        } catch(err) {
            console.error(err);
            process.exit(1);
        }

    }

    realInitTest() {
        console.log('ionic-build-actions : Init : Pre-Flight Test');

        let testScript = ' /** Pre-Flight Test must return 1 in case of success */ module.exports.main = function(){ console.log("buildAction_test"); return 1; }';
        let testScriptFile = process.cwd()+'/ionic-build-actions/buildAction_test.js';

        try {
            fs.writeFileSync(testScriptFile, testScript, { flag: 'w' }, function (err) {
                if (err) throw err;
            });
        } catch(err) {
            console.error(err);
            process.exit(1);
        }

        let testScriptRequire = require(testScriptFile);

        let testScriptRes = testScriptRequire.main();

        console.log('ionic-build-actions : Init : Pre-Flight Test : Result : ' + testScriptRes );

        if ( testScriptRes === 1 ) {
            console.log('ionic-build-actions : Init : Pre-Flight Test : PASS');
        } else {
            console.log('ionic-build-actions : Init : Pre-Flight Test : FAIL');
            console.log('ionic-build-actions : Init : Pre-Flight Test : Exiting');
            process.exit(1);
        }

    }

    main() {
        this.realInitProjectStructure();
        this.realInitTest();
    }

    welcome() {
        console.log( "ionic-build-actions : Welcome ! Author rept0id <rad@simplecode.gr>" );
        console.log( "ionic-build-actions : Executing" );
    }

    welcomeAfter() {
        console.log( "ionic-build-actions : Done" );
    }
}

class run {
    constructor() {

    }

    executeScripts(getGroupScriptsResString) {

        let getGroupScriptsResObj = JSON.parse(getGroupScriptsResString);

        let getGroupScriptsResItemPath = '';

        getGroupScriptsResObj.forEach(getGroupScriptsResItem => {

            getGroupScriptsResItemPath = process.cwd() + '/ionic-build-actions/' + getGroupScriptsResItem;

            if (fs.existsSync(getGroupScriptsResItemPath)) {
                console.log('ionic-build-actions : Run : Executing : FOUND : ' + getGroupScriptsResItemPath);
                console.log('ionic-build-actions : Run : Executing : RUNNING : ' + getGroupScriptsResItemPath);
                console.log('ionic-build-actions : Run : Executing : RESULT : START : ');
                let getGroupScriptsResItemRequire = require(getGroupScriptsResItemPath);

                let getGroupScriptsResItemRes = getGroupScriptsResItemRequire.main();
                console.log('ionic-build-actions : Run : Executing : RESULT : END');
            } else {
                console.log('ionic-build-actions : Run : Executing : NOT FOUND : ' + getGroupScriptsResItemPath);
            }
        });
    }

    getGroupScripts(InputSelectedGroup) {
        let result = [];

        const ConfPath = './ionic-build-actions/actions.json';

        let ConfRes = '';

        try {
            ConfRes = fs.readFileSync(ConfPath);
        } catch(err) {
            console.error(err);
            process.exit(1);
        }

        ConfRes = ConfRes.toString();

        let ConfResObj = JSON.parse(ConfRes);

        ConfResObj.forEach(ConfResObjItem => {
            if (ConfResObjItem.group === InputSelectedGroup) {
                result.push(ConfResObjItem.file);
            }
        });

        result = JSON.stringify(result);

        return result;
    }

    main(InputArgsItemRunParameters) {
        let InputSelectedGroup = InputArgsItemRunParameters.split('=')[1];
        console.log('ionic-build-actions : Run : Group : ' + InputSelectedGroup);

        let getGroupScriptsRes = this.getGroupScripts(InputSelectedGroup);

        this.executeScripts(getGroupScriptsRes);
    }
}

/** */

function main() {

    const InputArgs = process.argv.slice(2);

    /** */

    let initObj = new init();

    let runObj = new run();

    /** */

    initObj.main();

    initObj.welcome();

    /** */

    let InputArgsItemValue = '';

    InputArgs.forEach(InputArgsItem => {
        if ( InputArgsItem.includes('--run=') ) {
            InputArgsItemRunParameters = InputArgsItem;
            runObj.main(InputArgsItemRunParameters);
        }
    });

    /** */

    initObj.welcomeAfter();
}

main();