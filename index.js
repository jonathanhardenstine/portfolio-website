import express from "express";
import moment from "moment";
import bodyParser from "body-parser";
import env from "dotenv";
import axios from 'axios';

async function setJSONvar() {
    const requests = [
        axios.get("https://api.npoint.io/3afde83d436a472e10fd"), //skill_pages
        axios.get("https://api.npoint.io/8b977176889f22eafcc3"), //skill_types_contactform
        axios.get("https://api.npoint.io/adb8fcc1072339519069"), //skill_types
        axios.get("https://api.npoint.io/702326b83c75afe88d45") //skills_list
    ];

    await axios.all(requests).then(axios.spread((skill_pages, skill_types_contactform, skill_types, skills_list) => {
        // Handle the responses
        skill_pages_json = skill_pages.data;
        skill_types_contactform_json = skill_types_contactform.data;
        skill_types_json = skill_types.data;
        skills_list_json = skills_list.data;
        getJSONdata = false;
    }))
    .catch(error => {
        console.error('Error fetching data:', error);
    });
};

var getJSONdata = new Boolean(true);
var skill_pages_json;
var skill_types_contactform_json;
var skill_types_json;
var skills_list_json;

const app = express();
env.config();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.static("assets"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(port, async () => {
    console.log(`Server rnning on port: ${port}.`);
});


app.get("/", (req, res) => {

    const data = {
        "pageTitle": "Home",
        "UpdatedDate": moment().format('YYYY'),
    };
    res.render("home.ejs", data);
});


app.get("/about", (req, res) => {
    const data = {
        "pageTitle": "About",
        "UpdatedDate": moment().format('YYYY'),
    };
    res.render("about.ejs", data);
});

///////////////////
// contact routing
///////////////////
function setContactPageVariables(submitID, submitText, res) {
    const data = {
        "pageTitle": "Contact",
        "UpdatedDate": moment().format('YYYY'),
        "SkillTypes": skill_types_contactform_json,
        "SkillPages": Object.keys(skill_pages_json).map((key) => [skill_pages_json[key]["skillName"]]),
        "ShowSkill": Object.keys(skill_pages_json).map((key) => [skill_pages_json[key]["skillPageDetail"] == "" ? "No" : "Yes"]),
        "EmailJS_Public_Key": process.env.EmailJS_Public_Key,
        "EmailJS_Service_ID": process.env.EmailJS_Service_ID,
        "EmailJS_Template_ID": process.env.EmailJS_Template_ID,
        "emailJS_SubmitID": submitID,
        "emailJS_SubmitText": submitText
    };
    
    res.render("contact.ejs", data);
}

app.get("/contact", async (req, res) => {
    if (getJSONdata) {
        await setJSONvar();
    }

    if (JSON.stringify(req.query) === "{}") {
        setContactPageVariables("Default", "Hidden", res);
    } else if (req.query.Success) {
        setContactPageVariables("Success", req.query.Success, res);
    } else if (req.query.Failed) {
        setContactPageVariables("Failed", req.query.Failed, res);
    } else {
        setContactPageVariables("Failed", "ERROR...Unable to Send", res);
    }
});

///////////////////
// skills routing
///////////////////
app.get("/skillslist-*", async (req, res) => {
    if (getJSONdata) {
        await setJSONvar();
    }

    const data = {
        "/skillslist-analytics": {
            "pageTitle": "Skills",
            "UpdatedDate": moment().format('YYYY'),
            "skillTypeName": "Data Analytics",
            "skillTypeData": skill_types_json,
            "skillCards": skills_list_json["Data Analytics"]["SkillsList"],
            "Certifications": skills_list_json["Data Analytics"]["Certifications"]},
        "/skillslist-databases": {
            "pageTitle": "Skills",
            "UpdatedDate": moment().format('YYYY'),
            "skillTypeName": "Database Architecture",
            "skillTypeData": skill_types_json,
            "skillCards": skills_list_json["Database Architecture"]["SkillsList"],
            "Certifications": skills_list_json["Database Architecture"]["Certifications"]},
        "/skillslist-websites": {
            "pageTitle": "Skills",
            "UpdatedDate": moment().format('YYYY'),
            "skillTypeName": "Web Development",
            "skillTypeData": skill_types_json,
            "skillCards": skills_list_json["Web Development"]["SkillsList"],
            "Certifications": skills_list_json["Web Development"]["Certifications"]},
        "/skillslist-software": {
            "pageTitle": "Skills",
            "UpdatedDate": moment().format('YYYY'),
            "skillTypeName": "Software Development",
            "skillTypeData": skill_types_json,
            "skillCards": skills_list_json["Software Development"]["SkillsList"],
            "Certifications": skills_list_json["Software Development"]["Certifications"]}
    };
    
    res.render("skills-list.ejs", data[req.path]);
});

///////////////////
// individual skill page routing
///////////////////
app.get("/skillpage-*", async (req, res) => {

    if (getJSONdata) {
        await setJSONvar();
    }

    const data = {
        "pageTitle": "Skills",
        "UpdatedDate": moment().format('YYYY'),
        "skillTypeName": "N/A",
        "skillTypeData": skill_types_json,
        "skillName": skill_pages_json[req.path]["skillName"],
        "skillPageDetail": skill_pages_json[req.path]["skillPageDetail"],
        "Functionality": skill_pages_json[req.path]["Functionality"],
        "ProjectDocumentation": skill_pages_json[req.path]["Project Documentation"],
        "Video": skill_pages_json[req.path]["Video"],
        "CertificationPrimary": skill_pages_json[req.path]["Primary Certification"],
        "CertificationPrimaryAltText": skill_pages_json[req.path]["Primary Certification AltText"],
        "CertificationsAddtl": skill_pages_json[req.path]["Additional Certifications"]
    }

    res.render("skill-page.ejs", data);
});



