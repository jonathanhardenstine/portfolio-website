import express from "express";
import moment from "moment";
import bodyParser from "body-parser";
import env from "dotenv";
import skill_pages_json from "./assets/json/skill_pages.json" assert {type: "json"}
import skill_types_contactform_json from "./assets/json/skill_types_contactform.json" assert {type: "json"}
import skill_types_json from "./assets/json/skill_types.json" assert {type: "json"}
import skills_list_json from "./assets/json/skills_list.json" assert {type: "json"}

const app = express();
const port = 3000;
env.config();

app.use(express.static("public"));
app.use(express.static("assets"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(port, () => {
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

// if (JSON.stringify(req.query) === "{}") {
//     setContactPageVariables("Default", "Hidden", res);
// } else if (req.query.Success) {
//     setContactPageVariables("Success", req.query.Success, res);
// } else if (req.query.Failed) {
//     setContactPageVariables("Failed", req.query.Failed, res);
// } else {
//     setContactPageVariables("Failed", "ERROR...Unable to Send", res);
// }
    
app.get("/contact", (req, res) => {
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


// app.get("/contact", (req, res) => {
//     console.log(req.query);
//     if (JSON.stringify(req.query) === "{}") {
//         setContactPageVariables("Default", "Hidden", res);
//     } else if (req.query.FormSubmitted) {
//         var data = {
//             service_id: 'service_71ci4u4',
//             template_id: 'template_p1utgqa',
//             user_id: 'XW4n4PqJYrg-SBztK',
//             template_params: req.query.FormSubmitted
//         };
        
//         ajax('https://api.emailjs.com/api/v1.0/email/send', {
//             type: 'POST',
//             data: JSON.stringify(data),
//             contentType: 'application/json'
//         }).done(function() {
//             setContactPageVariables("Success", "SUCCESS!!!", res);
//         }).fail(function(error) {
//             setContactPageVariables("Failed", "ERROR..." + error, res);
//         });
//     } else {
//         setContactPageVariables("Failed", "ERROR...Unable to Send", res);
//     }
// });

///////////////////
// skills routing
///////////////////
app.get("/skillslist-*", (req, res) => {
    const data = {
        "/skillslist-analytics": {
            "pageTitle": "Skills",
            "UpdatedDate": moment().format('YYYY'),
            "skillTypeName": "Data Analytics",
            "skillTypeData": skill_types_json,
            "skillCards": skills_list_json["Data Analytics"],
            "Certifications": ["/images/Career Certification - Data Analyst Associate.png",
                            "images/Career Certification - Data Engineer Associate.png",
                            "/images/Technology Certification - SQL Associate.png"]},
        "/skillslist-databases": {
            "pageTitle": "Skills",
            "UpdatedDate": moment().format('YYYY'),
            "skillTypeName": "Database Architecture",
            "skillTypeData": skill_types_json,
            "skillCards": skills_list_json["Database Architecture"],
            "Certifications": []},
        "/skillslist-websites": {
            "pageTitle": "Skills",
            "UpdatedDate": moment().format('YYYY'),
            "skillTypeName": "Website Development",
            "skillTypeData": skill_types_json,
            "skillCards": skills_list_json["Website Development"],
            "Certifications": []},
        "/skillslist-software": {
            "pageTitle": "Skills",
            "UpdatedDate": moment().format('YYYY'),
            "skillTypeName": "Software Development",
            "skillTypeData": skill_types_json,
            "skillCards": skills_list_json["Software Development"],
            "Certifications": []}
    };
    
    res.render("skills-list.ejs", data[req.path]);
});

// function setSkillsListPageVariables (skillTypeValue, certicationsValue, res) {
//     const data = {
//         "pageTitle": "Skills",
//         "UpdatedDate": moment().format('YYYY'),
//         "skillTypeName": skillTypeValue,
//         "skillTypeData": skill_types_json,
//         "skillCards": skills_list_json[skillTypeValue],
//         "Certifications": certicationsValue
//     };

//     res.render("skills-list.ejs", data);
// }

// app.get("/skillslist-*", (req, res) => {
//     if (req.path === "/skillslist-analytics") {
//         const setCertificationsValue = ["/images/Career Certification - Data Analyst Associate.png",
//             "images/Career Certification - Data Engineer Associate.png",
//             "/images/Technology Certification - SQL Associate.png"];
//         setSkillsListPageVariables("Data Analytics", setCertificationsValue, res);
//     } else if (req.path === "") {
//         const setCertificationsValue = [];
//         setSkillsListPageVariables("Database Architecture", setCertificationsValue, res);
//     } else if (req.path === "") {
//         const setCertificationsValue = [];
//         setSkillsListPageVariables("Website Development", setCertificationsValue, res);
//     } else if (req.path === "") {
//         const setCertificationsValue = [];
//         setSkillsListPageVariables("Software Development", setCertificationsValue, res);
//     }
// });

///////////////////
// individual skill page routing
///////////////////
app.get("/skillpage-*", (req, res) => {
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
        "CertificationsAddtl": skill_pages_json[req.path]["Additional Certifications"]
    }

    res.render("skill-page.ejs", data);
});



