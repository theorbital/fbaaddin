var arand = function(min, max) {
    return min + Math.floor(Math.random() * (max - min));
};

var randUser = arand(0, 9);

function invokeRequest(par1, par2, par3, country) {
    randUser = arand(0, 9);

  var protocol = 'https:';
    if (!protocol)
        protocol = 'http:';

    var base = protocol + '//webservices.amazon.' + country + '/onca/xml?Service=AWSECommerceService';
    var timestamp = '&Timestamp=' + new Date().toISOString();
    var associate = '&AssociateTag=' + getAssociateTag();
    var par1 = '&Operation=' + par1;
    var par2 = '&ItemId=' + par2;
    var par3 = '&ResponseGroup=' + par3;
    var par4 = '&Version=2011-08-01';


    var unsignedUrl = base + par1 + par2 + par3 + par4 + timestamp + associate;


    var lines = unsignedUrl.split("\n");
    unsignedUrl = "";
    for (var i in lines) {
        unsignedUrl += lines[i];
    }

    // find host and query portions
    var urlregex = new RegExp("^" + protocol + "\\/\\/(.*)\\/onca\\/xml\\?(.*)$");
    var matches = urlregex.exec(unsignedUrl);

    if (matches == null) {
        alert("Could not find PA-API end-point in the URL. Please ensure the URL looks like the example provided.");
        return;
    }


    var host = matches[1].toLowerCase();
    var query = matches[2];

    // split the query into its constituent parts
    var pairs = query.split("&");

    // remove signature if already there
    // remove access key id if already present 
    //  and replace with the one user provided above
    // add timestamp if not already present
    pairs = cleanupRequest(pairs);

    // show it
    //document.getElementById("NameValuePairs").value = pairs.join("\n");

    // encode the name and value in each pair
    pairs = encodeNameValuePairs(pairs);

    // sort them and put them back together to get the canonical query string
    pairs.sort();
    //document.getElementById("OrderedPairs").value = pairs.join("\n");

    var canonicalQuery = pairs.join("&");
    var stringToSign = "GET\n" + host + "\n/onca/xml\n" + canonicalQuery;

    // calculate the signature
    var secret = getSecretAccessKey();
    var signature = sign(secret, stringToSign);

    // assemble the signed url
    var signedUrl = protocol + "//" + host + "/onca/xml?" + canonicalQuery + "&Signature=" + signature;

    // update the UI
    //var stringToSignArea = document.getElementById("StringToSign");
    //stringToSignArea.value = stringToSign;

    //var signedURLArea = document.getElementById("res");
    ///signedURLArea.innerHTML = signedUrl;
    return (signedUrl);
}

function encodeNameValuePairs(pairs) {
    for (var i = 0; i < pairs.length; i++) {
        var name = "";
        var value = "";

        var pair = pairs[i];
        var index = pair.indexOf("=");

        // take care of special cases like "&foo&", "&foo=&" and "&=foo&" 
        if (index == -1) {
            name = pair;
        } else if (index == 0) {
            value = pair;
        } else {
            name = pair.substring(0, index);
            if (index < pair.length - 1) {
                value = pair.substring(index + 1);
            }
        }

        // decode and encode to make sure we undo any incorrect encoding
        name = encodeURIComponent(decodeURIComponent(name));

        value = value.replace(/\+/g, "%20");
        value = encodeURIComponent(decodeURIComponent(value));

        pairs[i] = name + "=" + value;
    }

    return pairs;
}

function cleanupRequest(pairs) {
    var haveTimestamp = false;
    var haveAwsId = false;
    var accessKeyId = getAccessKeyId();

    var nPairs = pairs.length;
    var i = 0;
    while (i < nPairs) {
        var p = pairs[i];
        if (p.search(/^Timestamp=/) != -1) {
            haveTimestamp = true;
        } else if (p.search(/^(AWSAccessKeyId|SubscriptionId)=/) != -1) {
            pairs.splice(i, 1, "AWSAccessKeyId=" + accessKeyId);
            haveAwsId = true;
        } else if (p.search(/^Signature=/) != -1) {
            pairs.splice(i, 1);
            i--;
            nPairs--;
        }
        i++;
    }

    if (!haveTimestamp) {
        pairs.push("Timestamp=" + getNowTimeStamp());
    }

    if (!haveAwsId) {
        pairs.push("AWSAccessKeyId=" + accessKeyId);
    }
    return pairs;
}

function sign(secret, message) {
    var messageBytes = str2binb(message);
    var secretBytes = str2binb(secret);

    if (secretBytes.length > 16) {
        secretBytes = core_sha256(secretBytes, secret.length * chrsz);
    }

    var ipad = Array(16),
        opad = Array(16);
    for (var i = 0; i < 16; i++) {
        ipad[i] = secretBytes[i] ^ 0x36363636;
        opad[i] = secretBytes[i] ^ 0x5C5C5C5C;
    }

    var imsg = ipad.concat(messageBytes);
    var ihash = core_sha256(imsg, 512 + message.length * chrsz);
    var omsg = opad.concat(ihash);
    var ohash = core_sha256(omsg, 512 + 256);

    var b64hash = binb2b64(ohash);
    var urlhash = encodeURIComponent(b64hash);

    return urlhash;
}

function addZero(n) {
    return (n < 0 || n > 9 ? "" : "0") + n;
}

function getNowTimeStamp() {
    var time = new Date();
    var gmtTime = new Date(time.getTime() + (time.getTimezoneOffset() * 60000));
    return gmtTime.toISODate();
}

var ak = [];
ak[0] = 'AKIAJNPYJEQBZBQOYMQA'; 
ak[1] = 'AKIAJFXFDBSBZQP7CJ6A';
ak[2] = 'AKIAI7JNJSWQ2HJWFDBA';
ak[3] = 'AKIAIROV4NYLW6IUQDGA';
ak[4] = 'AKIAJQCY3CUBEAJGVAIA'; 
ak[5] = 'AKIAJWHIJOSFBIVVONQA';
ak[6] = "AKIAJCYNCG2DQKB3ZNNA";
ak[7] = "AKIAIW575FMDVWAJHFDA";
ak[8] = "AKIAIUWCVTQ2UJD75FXA";
ak[9] = "AKIAIUVEUJD5V2FG3K4A";

var sk = [];
sk[0] = 'rvSle4tIAr0uq22XxepRpM9DYf0xO3If62KrzRqY'; 
sk[1] = 'zPGsRv1N7yiL10AEg/ryCMJeOceSeZflIRRS/VC9';
sk[2] = 'yN82zTLj8ruwk9XBjtlf4xCoGfk2KC6ZAc2vDWZn';
sk[3] = 'yR9oS6Qolwab+4TQyBiwceiAES91oJxLRYiwZ43n';
sk[4] = 'G1gGgbR21jn1Ea6xYmBjH7JCcVYmuJUfZ/mGxBIe'; 
sk[5] = 'RPJPIjGWCImBA1xwCRSe7MKaS5VYvRN9NJ09pEp0';
sk[6] = "m2rQWihUb5rAODc1+BMwRRfhbK8sLIRT5LM0YVqf";
sk[7] = "AYhxZV/SsUDkEP3tffklvZmKZYlF3vLFSD56S9YX";
sk[8] = "Fpj3fgO+yQDoAcbHz6AF+qT0MVq/s+RviB9NXMNE";
sk[9] = "Om+guKBd86thHN4roy3PaFaS8XqNghFIQli6kMkp";

function getAccessKeyId() {
    return ak[randUser];
}

function getSecretAccessKey() {
    return sk[randUser];
}

function getAssociateTag() {
    return 'howmany04-20';
}
