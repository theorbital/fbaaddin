/**
* @OnlyCurrentDoc
*/


// Add a custom menu to the active spreadsheet, including a separator and a sub-menu.
function onInstall(e){
  onOpen(e);
  
}

function onOpen(e) { 
SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
      .createMenu('FBA Formulas')
      .addItem('Show formulas', 'showSidebar')
      .addToUi();
}

function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Page')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setTitle('FBA Formulas')
      .setWidth(300);
  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
      .showSidebar(html);
}

/*

function userInfo(){ 
// Display a dialog box with a title, message, input field, and "Yes" and "No" buttons. The
 // user can also close the dialog by clicking the close button in its title bar.
 var ui = SpreadsheetApp.getUi();
 var response = ui.prompt('Scanpower Credentials', 'Scanpower Username', ui.ButtonSet.OK_CANCEL);

 // Process the user's response.
 if (response.getSelectedButton() == ui.Button.OK) {
   Logger.log('The user\'s name is %s.', response.getResponseText());
   var username = response.getResponseText();
   ui.alert(username);
 } else if (response.getSelectedButton() == ui.Button.CANCEL) {
   Logger.log('The user didn\'t want to provide a name.');
 } else {
   Logger.log('The user clicked the close button in the dialog\'s title bar.');
 }
  
  var response = ui.prompt('Scanpower Credentials', 'Scanpower Password', ui.ButtonSet.OK_CANCEL);

 // Process the user's response.
 if (response.getSelectedButton() == ui.Button.OK) {
   Logger.log('The user\'s name is %s.', response.getResponseText());
   var password = response.getResponseText();
   
 } else if (response.getSelectedButton() == ui.Button.CANCEL) {
   Logger.log('The user didn\'t want to provide a name.');
 } else {
   Logger.log('The user clicked the close button in the dialog\'s title bar.');
 }
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty('username', username);

}
*/

/**
 * Display the FBA Fees of an item.
 *
 * @param {"B017V4U5U2"} query
 *        Either the ASIN or the UPC.
 *
 * @customfunction
*/

function fbaFees(query) {
 
  var maxTries = 3;
  var tries = 0;
  var res, body;
  do {
     tries++;
    if (tries > 1) {
      Utilities.sleep(1000);
    } else {
      Logger.log('GET %s');
    }

  //var query = "B017V4U5U2"
  var headers = {
   "Authorization" : "null"
  };

  var params = {
    "method":"GET",
    "headers":headers
  };

   var res = UrlFetchApp.fetch("https://unity.scanpower.com/net-payout?upc=" + query + "&price=&marketplace=US&detail=", params);
    
    body = res.getContentText();
  } while (!body && (tries < maxTries));
  if (!body) {
    throw new Error('Unable to fetch JSON after ' + tries + ' attempts: ');
  }
  var out = JSON.parse(res.getContentText());
  var num = parseInt(out.fees.total);
  var dollars = "$" + num / 100;
  return dollars
 }

//////////////// NETPAYOUT /////////////////

/**
 * Display the net payout of an item.
 *
 * @param {"B00VVU0MYM"} query
 *        Either the ASIN or the UPC. 
 * @param {"10.76"} price
 *  Enter the price to figure the referral fee.
 *
 * @customfunction
 */

function NetPayout(query, price) {
  
  //var query = "B00VVU0MYM"
  //var price = 10.76;
  
  var maxTries = 3;
  var tries = 0;
  var res, body;
  do {
     tries++;
    if (tries > 1) {
      Utilities.sleep(1000);
      Logger.log('GET %s (try #%s)', tries);
    } else {
      Logger.log('GET %s');
    }

  //var input = "B017V4U5U2"
  var headers = {
   "Authorization" : "null"
  };

  var params = {
    "method":"GET",
    "headers":headers
  };
    
   var price = price.toString(); 
   var price =  Math.round(100 * parseFloat(price.replace(/[$,]/g, '')));
    
   var res = UrlFetchApp.fetch("https://unity.scanpower.com/net-payout?upc=" + query + "&price=" + price + "&marketplace=US&basic", params);
    
    body = res.getContentText();
  } while (!body && (tries < maxTries));
  if (!body) {
    throw new Error('Unable to fetch JSON after ' + tries + ' attempts: ');
  }

  var out = JSON.parse(res.getContentText());
  var num = parseInt(out.payout);
  var dollars = num / 100;
  return dollars
 }

///////////////// LOWEST PRICE /////////////////////

/**
 * Display the lowest price of an item.
 *
 * @param {"B00VVU0MYM"} query
 *        Either the ASIN or the UPC.
 *
 * @customfunction
 */

function LowestPrice(query) {
  
  var maxTries = 3;
  var tries = 0;
  var res, body;
  do {
     tries++;
    if (tries > 1) {
      Utilities.sleep(1000);
      Logger.log('GET %s (try #%s)', tries);
    } else {
      Logger.log('GET %s');
    }

  //var query = "B017V4U5U2"
  var headers = {
   "Authorization" : "null"
  };

  var params = {
    "method":"GET",
    "headers":headers
  };

   var res = UrlFetchApp.fetch("https://unity.scanpower.com/item/" + query + "&detail", params);
    
    body = res.getContentText();
  } while (!body && (tries < maxTries));
  if (!body) {
    throw new Error('Unable to fetch JSON after ' + tries + ' attempts: ');
  }
  
  //var result = JSON.parse(response.getContentText());
  
  
  var out = JSON.parse(res.getContentText());
    if ('lowprice' in out[query].items[0]) {
    var num = out[query].items[0].lowprice;
      var dollars = num / 100;
  return dollars
  }
  else 
  {
   return "No offers" 
  }
 }

///////////////// LOWEST FBA PRICE /////////////////////

/**
 * Display the lowest FBA price of an item.
 *
 * @param {"B00VVU0MYM"} query
 *        Either the ASIN or the UPC.
 *
 * @customfunction
 */

function Lowestfba(query) {
  
  var maxTries = 3;
  var tries = 0;
  var res, body;
  do {
     tries++;
    if (tries > 1) {
      Utilities.sleep(1000);
      Logger.log('GET %s (try #%s)', tries);
    } else {
      Logger.log('GET %s');
    }

  //var query = "B017V4U5U2"
  var headers = {
   "Authorization" : "null"
  };

  var params = {
    "method":"GET",
    "headers":headers
  };

   var res = UrlFetchApp.fetch("https://unity.scanpower.com/scout/search?q=" + query + "&deviceId=&marketplace=US", params);
    
    body = res.getContentText();
  } while (!body && (tries < maxTries));
  if (!body) {
    throw new Error('Unable to fetch JSON after ' + tries + ' attempts: ');
  }

  var out = JSON.parse(res.getContentText());
  if ('fba' in out[query].items[0].lowest_offers) {
    var num = out[query].items[0].lowest_offers.fba[0].price;
      var dollars = num / 100;
  return dollars
  }
  else 
  {
   return "No FBA offers" 
  }
 
 }

///////////////// Amazon's Price /////////////////////

/**
 * Display the price of amazon if they are on the listing.
 *
 * @param {"B00VVU0MYM"} query
 *        Either the ASIN or the UPC.
 *
 * @customfunction
 */

function amzprice(query) {
  
  var maxTries = 3;
  var tries = 0;
  var res, body;
  do {
     tries++;
    if (tries > 1) {
      Utilities.sleep(1000);
      Logger.log('GET %s (try #%s)', tries);
    } else {
      Logger.log('GET %s');
    }

  var headers = {
   "Authorization" : "null"
  };

  var params = {
    "method":"GET",
    "headers":headers
  };

   var res = UrlFetchApp.fetch("https://unity.scanpower.com/scout/search?q=" + query + "&deviceId=&marketplace=US", params);
    
    body = res.getContentText();
  } while (!body && (tries < maxTries));
  if (!body) {
    throw new Error('Unable to fetch JSON after ' + tries + ' attempts: ');
  }

  var out = JSON.parse(res.getContentText());
  if ('amazon' in out[query].items[0]) {
    var num = out[query].items[0].amazon.price;
      var dollars = num / 100;
  return dollars
  }
  else 
  {
   return "No AMZ Offers" 
  }
 
 }

////////// BEST SELLERS RANK //////////////////

/**
 * Display the best sellers rank.
 *
 * @param {"B00VVU0MYM"} query
 *        Either the ASIN or the UPC.
 *
 * @customfunction
 */

function bsr(query) {
  
  var maxTries = 3;
  var tries = 0;
  var res, body;
  do {
     tries++;
    if (tries > 1) {
      Utilities.sleep(1000);
      Logger.log('GET %s (try #%s)', tries);
    } else {
      Logger.log('GET %s');
    }

  //var query = "B017V4U5U2"
  var headers = {
   "Authorization" : "null"
  };

  var params = {
    "method":"GET",
    "headers":headers
  };

   var res = UrlFetchApp.fetch("https://unity.scanpower.com/item/" + query + "&detail", params);
    
    body = res.getContentText();
  } while (!body && (tries < maxTries));
  if (!body) {
    throw new Error('Unable to fetch JSON after ' + tries + ' attempts: ');
  }
  
  var out = JSON.parse(res.getContentText());
  num = out[query].items[0].rank
  if (num != null) {
    var num = out[query].items[0].rank;
  return num
  }
  else 
  {
   return "N/A" 
  }
 }

////////// CATEGORY //////////////////

/**
 * Display the parent category of an item.
 *
 * @param {"B00VVU0MYM"} query
 *        Either the ASIN or the UPC.
 *
 * @customfunction
 */

function AmzCategory(query) {
  
  var maxTries = 3;
  var tries = 0;
  var res, body;
  do {
     tries++;
    if (tries > 1) {
      Utilities.sleep(1000);
      Logger.log('GET %s (try #%s)', tries);
    } else {
      Logger.log('GET %s');
    }
  
  //var query = "B017V4U5U2"
  var headers = {
   "Authorization" : "null"
  };

  var params = {
    "method":"GET",
    "headers":headers
  };

   var res = UrlFetchApp.fetch("https://unity.scanpower.com/item/" + query + "&detail", params);
    
    body = res.getContentText();
  } while (!body && (tries < maxTries));
  if (!body) {
    throw new Error('Unable to fetch JSON after ' + tries + ' attempts: ');
  }

  var out = JSON.parse(res.getContentText());
  category = out[query].items[0].group
  
  function azswitch(searchValue) {
//define the array of results
    var results = {Toy: "Toys & Games", Grocery: "Grocery & Gourmet Food", 'Health and Beauty': "Health & Personal Care",
                   Home: "Home and Kitchen", Kitchen: "Kitchen & Dining", Apparel: "Clothing", 'Baby Product': "Baby",
                   'Sports Apparel': "Sports & Outdoors", 'Home Improvement': "Home Improvements", Shoes: "Shoes", BEAUTY: "Beauty", 
                   Wireless: "Cell Phones & Accessories", 'Pet Products': "Pet Supplies", Furniture: "Home and Garden", DVD: "Movies & TV"};
  
  Logger.log(searchValue);
  
//return the correct result
var res = results[searchValue];
    if (!res) {
     res = category 
    }
  return res;
  Logger.log(res);
  
}

  
  var res = azswitch(category)
  return res;
 }

///////////////// WEIGHT /////////////////////

/**
 * Display the weight of the package.
 *
 * @param {"B00VVU0MYM"} query
 *        Either the ASIN or the UPC.
 * @return Weight of item
 *
 * @customfunction
 */

function amzweight(query) {
  
  var maxTries = 3;
  var tries = 0;
  var res, body;
  do {
     tries++;
    if (tries > 1) {
      Utilities.sleep(1000);
      Logger.log('GET %s (try #%s)', tries);
    } else {
      Logger.log('GET %s');
    }

  //var query = "B017V4U5U2"
  var headers = {
  
   "Authorization" : "null"
  };

  var params = {
    "method":"GET",
    "headers":headers
  };

   var res = UrlFetchApp.fetch("https://unity.scanpower.com/scout/search?q=" + query + "&deviceId=&marketplace=US", params);
    
    body = res.getContentText();
  } while (!body && (tries < maxTries));
  if (!body) {
    throw new Error('Unable to fetch JSON after ' + tries + ' attempts: ');
  }
    
  var out = JSON.parse(res.getContentText());
  if ('weight' in out[query].items[0].package) {
    var num = out[query].items[0].package.weight;
      var weight = num / 100;
  return weight
  }
  else 
  {
   return "No weight info" 
  }
 
 }

///////////////// JUNGLE SCOUT /////////////////////

/**
 * Display the estimated sales.
 *
 * @param {765} rank Enter the Best Sellers Rank.
 * @param {"Toys & Games"} category Enter the item's category       
 *
 * @customfunction
 */


function estSales(rank, category) {
  
  //var rank = "7546"
 // var category = "Toys & Games"
  
  
  var maxTries = 3;
  var tries = 0;
  var res, body;
  do {
     tries++;
    if (tries > 1) {
      Utilities.sleep(1000);
      Logger.log('GET %s (try #%s)', tries);
    } else {
      Logger.log('GET %s');
    }

  //var query = "B017V4U5U2"
  var headers = {
    "Referer" : "https://www.amazon.com/gp/offer-listing/B010F029Y4/"
  };

  var params = {
    "method":"GET",
    "headers":headers
  };
 
    var res = UrlFetchApp.fetch("https://junglescoutpro.herokuapp.com/api/v1/est_sales?store=us&category=" +encodeURIComponent(category)+ "&rank=" + rank, params);
    
    body = res.getContentText();
  } while (!body && (tries < maxTries));
  if (!body) {
    throw new Error('Unable to fetch JSON after ' + tries + ' attempts: ');
  }
    
  var out = JSON.parse(res.getContentText());
  out = out.estSalesResult;
  return out
  Logger.log(out);
 }

//////////////// Product Title ////////////////////////
/**
 * Display the title of the product.
 *
 * @param {"B00VVU0MYM"} query
 *        Either the ASIN or the UPC.
 *
 * @customfunction
 */

function amztitle(query){
  var maxTries = 3;
  var tries = 0;
  var res, body;
  do {
     tries++;
    if (tries > 1) {
      Utilities.sleep(1000);
      Logger.log('GET %s (try #%s)', tries);
    } else {
      Logger.log('GET %s');
    }
  //var query = "B017V4U5U2"
  var headers = {
   
   "Authorization" : "null"
  };

  var params = {
    "method":"GET",
    "headers":headers
  };

   var res = UrlFetchApp.fetch("https://unity.scanpower.com/scout/search?q=" + query + "&deviceId=&marketplace=US", params);
    
    body = res.getContentText();
  } while (!body && (tries < maxTries));
  if (!body) {
    throw new Error('Unable to fetch JSON after ' + tries + ' attempts: ');
  }

  var out = JSON.parse(res.getContentText());
  if ('total' in out[query].items[0].offercount.fba) {
    var num = out[query].items[0].offercount.fba.total;
  return num
  }
  else 
  {
   return "No fba seller info" 
  }
 
 }

///////////////// FBA SELLER COUNT /////////////////////

/**
 * Display the number of fba sellers on a listing.
 *
 * @param {"B00VVU0MYM"} query
 *        Either the ASIN or the UPC.
 *
 * @customfunction
 */

function fbaSellerCount(query) {
  
  var maxTries = 3;
  var tries = 0;
  var res, body;
  do {
     tries++;
    if (tries > 1) {
      Utilities.sleep(1000);
      Logger.log('GET %s (try #%s)', tries);
    } else {
      Logger.log('GET %s');
    }
  //var query = "B017V4U5U2"
  var headers = {
   
   "Authorization" : "null"
  };

  var params = {
    "method":"GET",
    "headers":headers
  };

   var res = UrlFetchApp.fetch("https://unity.scanpower.com/scout/search?q=" + query + "&deviceId=&marketplace=US", params);
    
    body = res.getContentText();
  } while (!body && (tries < maxTries));
  if (!body) {
    throw new Error('Unable to fetch JSON after ' + tries + ' attempts: ');
  }

  var out = JSON.parse(res.getContentText());
  if ('total' in out[query].items[0].offercount.fba) {
    var num = out[query].items[0].offercount.fba.total;
  return num
  }
  else 
  {
   return "No fba seller info" 
  }
 
 }

////////////////// GET AVERAGE COST ////////////////////////
/**
 * Gets the average cost for an item from Scanpower's database
 *
 * @param {"B00HGY56F7"} input Enter either an 11 or 12 digit upc.
 *
 * @customfunction
 */

function averageCost(input){
  
  //var input = "B00KSNJKMS";
  
  var maxTries = 3;
  var tries = 0;
  var res, body;
  do {
     tries++;
    if (tries > 1) {
      Utilities.sleep(1000);
      Logger.log('GET %s (try #%s)', tries);
    } else {
      Logger.log('GET %s');
    }
  //var query = "B017V4U5U2"
  var headers = {
   
   "Authorization" : "null",
    "X-Requested-With" : "XMLHttpRequest"
  };

  var params = {
    "method":"GET",
    "headers":headers
  };

   var res = UrlFetchApp.fetch("https://unity.scanpower.com/inventory/?view&search=" + input, params);
    
    body = res.getContentText();
  } while (!body && (tries < maxTries));
  if (!body) {
    throw new Error('Unable to fetch JSON after ' + tries + ' attempts: ');
  }
  var x = 0;
  var j = "avg-cost-fmt";  
  var out = JSON.parse(res.getContentText());
  
    var cost = out[x][j];
   Logger.log(cost);
  return cost
 
  
}

////////////////// GET LAST PURCHASED DATE ////////////////////////
/**
 * Gets the last purchased date for an item from Scanpower's database
 *
 * @param {"B00HGY56F7"} input Enter either an 11 or 12 digit upc.
 *
 * @customfunction
 */

function lastPurchased(input){
  
  //var input = "B00KSNJKMS";
  
  var maxTries = 3;
  var tries = 0;
  var res, body;
  do {
     tries++;
    if (tries > 1) {
      Utilities.sleep(1000);
      Logger.log('GET %s (try #%s)', tries);
    } else {
      Logger.log('GET %s');
    }
  //var query = "B017V4U5U2"
  var headers = {
   
   "Authorization" : "null",
    "X-Requested-With" : "XMLHttpRequest"
  };

  var params = {
    "method":"GET",
    "headers":headers
  };

   var res = UrlFetchApp.fetch("https://unity.scanpower.com/inventory/?view&search=" + input, params);
    
    body = res.getContentText();
  } while (!body && (tries < maxTries));
  if (!body) {
    throw new Error('Unable to fetch JSON after ' + tries + ' attempts: ');
  }
  var x = 0;
  var j = "last-purchased";  
  var out = JSON.parse(res.getContentText());
  
    var cost = out[x][j];
   Logger.log(cost);
  return cost
 
  
}

////////////////// CHECK DIGIT CALCULATOR //////////////////
/**
 * Calculates the check digit and returns the check digit.
 *
 * @param {"08-86798-53637"} input Enter either an 11 or 12 digit upc.
 *
 * @param {"UPC"} returnType OPTIONAL - Enter "UPC" to get the UPC returned. 
 *   Must put double quotes around the word for it to work.
 *        
 *         
 *        
 *
 * @customfunction
 */

function checkDigitCalc(input, returnType) {
  
  //var input = "00-99555-08831"
 // var UPC
  //var ASIN
  //var returnType = "ASIN";
  var returnType;
  var r;
  
  if (returnType != null) {
  var r = returnType.toString().toUpperCase();
  }
function reverse(s){
    return s.split("").reverse().join("");
}

// function to calculate EAN / UPC checkdigit
function eanCheckDigit(s)
{
	var result = 0;
	var rs = reverse(s);
	for (counter = 0; counter < rs.length; counter++)
	{
		result = result + parseInt(rs.charAt(counter)) * Math.pow(3, ((counter+1) % 2));
	}
	return (10 - (result % 10)) % 10;
}
  var input = input.replace(/-/g, "");
  var res = eanCheckDigit(input)
  var upc = input + res;
  if(r == "UPC"){
   return upc; 
  }
  else if (r == "ASIN") {
   var asin = getASIN(upc); 
    //Logger.log(asin)
   return asin;
    
  }
  else{
  return res;
  }
}

////////////////// GET ASIN //////////////////
/**
 * Returns the ASIN.
 *
 * @param {"08-86798-53637"} query Enter UPC.
 *
 *         
 *        
 *
 * @customfunction
 */

function getASIN(query) {
  var maxTries = 3;
  var tries = 0;
  var res, body;
  do {
     tries++;
    if (tries > 1) {
      Utilities.sleep(1000);
      Logger.log('GET %s (try #%s)', tries);
    } else {
      Logger.log('GET %s');
    }

  //var query = "0027917019451"  
  
  
  var headers = {
   "Authorization" : "null"
  };

  var params = {
    "method":"GET",
    "headers":headers
  };

   var res = UrlFetchApp.fetch("https://unity.scanpower.com/scout/search?q=" + query + "&deviceId=&marketplace=US", params);
    
    body = res.getContentText();
  } while (!body && (tries < maxTries));
  if (!body) {
    throw new Error('Unable to fetch JSON after ' + tries + ' attempts: ');
  }
 
  var out = JSON.parse(res.getContentText());
  if ('items' in out[query]) {
    
    for (var i = 0; i < out[query].items.length; i++){
     a = out[query].items[i].asin
     d = []
     d.push(a)
    }
    res = d.join();
   /* 
    if(out[query].items.length > 1){

       var numOfAsins = (out[query].items.length);
       var res = "MULTIPLE("+numOfAsins+")";
      
      
      for (var i = 0; i < out[query].items.length; i++){
        var item = out[query].items[i];
        var asin = member.character.name; // This is the member's character name
      }
     
    */
      
     }
    else if (out[query].items.length = 1){
    var res = out[query].items[0].asin;
      return res
    
  }
  
  
  else 
  {
   res = "No ASIN Available" 
  }
  
  //Logger.log(res);
  return res;
  
  }

////////////////// GET MIN PRICE //////////////////
/**
 * Calculates the check digit and returns the check digit.
 *
 * @param {"2.47"} netpayout Net Payout.
 *
 * @param {"Cost"} cost Enter Cost of item
 * @param {"50%"} roi Enter the percentage you would like to make on the cost of the item.       
 * @param {"5.2 LBs"} weight - Optional Enter the weight of the item        
 * @param {".20"} weightCost - Optional Enter the inbound shipping cost       
 *
 * @customfunction
 */

function calcMin(netpayout, cost, roi, weight, weightCost) {
  //var netpayout = netpayout.toString();
 //if (netpayout = ""){ throw new Error ("Must enter netpayout and must be number")}
  var roi = '.' + parseFloat(roi)
  if (weight && weightCost != null) {
  var weightCalc = parseFloat(weight) * weightCost;
    var x = netpayout + (cost*roi) + weightCalc;
  } else {
  var x = netpayout + (cost*roi);
  }
  return x;
  
}


function howMany(ASIN){
  
  var asin = "B003NSBVQS";
  
  var g = invokeRequest('ItemLookup', asin, 'Offers', 'com')
  //var getOfferId = UrlFetchApp.fetch(g).getContentText();
  var getOfferId = UrlFetchApp.fetch(g).getContentText();
  var halfParsed = getOfferId.split("<OfferListingId>");
  var halfParsedJ = halfParsed.join();
  var fullParsed = halfParsedJ.split("</OfferListingId>");
  var j = fullParsed.join();
  var h = j.split(",");
  var o = h[1];
  Logger.log(o);
  
  var offerId = o; 
  
  var payload = '&Item.1.OfferListingId='+offerId+'&Item.1.Quantity=999';
  var urlToRequest = invokeRequest('CartCreate', payload, 'Cart', 'com');
  
  var res = UrlFetchApp.fetch(urlToRequest);
  Logger.log(res.getContentText());
 //var qty = res.find('CartItem>Quantity').text();
}

//////// KEEPA 90 DAY SALES RANK ///////////////
/**
 * Gets the 90 day sales rank average from keepa.
 *
 * @param {"B00GHJ768} query Enter valid ASIN.
 *
 * @customfunction
 */

function keepa90(query){
  
  var data = []
  var res;
  // Test query variable
 //var query = "B00061ETX2"
  var query = query.toString();
  var res = keepaAPI.getProduct(1, query)
  
  //GET SALES VALUE
  if( res.products[0].stats[keepaAPI.CsvType.SALES.index] != null ){
  var salesValue = parseInt(res.products[0].stats[keepaAPI.CsvType.SALES.index].avg.val)
  var salesValue = Math.round(salesValue);
  //Logger.log(data)
  //return salesValue
    data.push(salesValue)
    Logger.log(data)
  }
  else {
    Logger.log(res)
   return "No Sales Rank Available" 
  }
  /*
  var activeRow = SpreadsheetApp.getActiveSheet().getActiveCell().getRow();
  var activeColumn = SpreadsheetApp.getActiveSheet().getActiveCell().getColumn();
 SpreadsheetApp.getActiveSpreadsheet().getSheets()[0].getRange(activeRow,activeColumn,data.length,data[0].length).setValues(data);
*/
  return salesValue;
}


/////////// KEEPA GRAPH ///////////

/**
 * Gets the Link for the Graph Image from Keepa.
 *
 * @param {"B00GHJ768} query Enter valid ASIN.
 * @param {90} range Enter the range in days. Valid numbers are 1, 2, 7, 31, 90 and 365.
 *
 * @customfunction
 */

function keepaImage(query, range) {
  //return IMAGE("https://dyn.keepa.com/pricehistory.png?asin=B001GZ6QEC&domain=com&salesRank=1", 3)
 //var query = "B001GZ6QEC"
 //var range = 90;
 var value = 'https://dyn.keepa.com/pricehistory.png?asin=' + query + '&domain=com&salesrank=1&amazon=1&range='+ range + '&new=1&height=400&width=900';
 return value;  
 }
