const licenceKey = "-- Would be provided by Verifie Global --";
const personID = window.navigator.userAgent;


var getAccessToken = async () => {
    const result =  await fetch(`https://api.verifie.ai/api/Main/AccessToken?LicenseKey=${licenceKey}&PersonID=${personID}`);
    const res = await result.json();
    return res.result.accessToken;
}

let accessToken;
getAccessToken().then((res) => {
    accessToken = res;
});

var getDocumentData = async (imageData) => {
    const headers = {
        'Content-Type': 'application/json-patch+json',
        'Authorization': accessToken,
    }

    const body = {
        documentImage: imageData
    };

    const result = await fetch("https://api.verifie.ai/api/Main/Document", {
        method: 'POST',
        body: JSON.stringify(body),
        headers,
    });
    const res = await result.json();
    return res;
}

var getScoringData = async (imageData) => {
    const headers = {
        'Content-Type': 'application/json-patch+json',
        'Authorization': accessToken,
    }

    const body = {
        selfieImage: imageData
    };

    const result = await fetch("https://api.verifie.ai/api/Main/Score", {
        method: 'POST',
        body: JSON.stringify(body),
        headers,
    });
    const res = await result.json();
    return res;
}
