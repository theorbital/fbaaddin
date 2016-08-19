var keepaAPI = (function () {
	var KEY = "a2vs2p6jcm0jp33c92rv998a7rv6c437jvgiutj2s3hqnab98t0nvns4uoamn2j8";
	var endpoint = "https://api.keepa.com/";

	var CsvType = {
		AMAZON: {index: 0, deal: true, currency: true, isEnabled: true},
		NEW: {index: 1, deal: true, currency: true, isEnabled: true},
		USED: {index: 2, deal: true, currency: true, isEnabled: true},
		SALES: {index: 3, deal: true, currency: false, isEnabled: true},
		LISTPRICE: {index: 4, deal: false, currency: true, isEnabled: true},
		COLLECTIBLE: {index: 5, deal: true, currency: true, isEnabled: true},
		REFURBISHED: {index: 6, deal: true, currency: true, isEnabled: true},

		NEWSHIPPING: {index: 7, deal: false, currency: true, isEnabled: false},
		LIGHTNING_DEAL: {index: 8, deal: true, currency: true, isEnabled: true},
		WAREHOUSE: {index: 9, deal: false, currency: true, isEnabled: false},
		FBA: {index: 10, deal: false, currency: true, isEnabled: false},

		COUNT_NEW: {index: 11, deal: false, currency: false, isEnabled: true},
		COUNT_USED: {index: 12, deal: false, currency: false, isEnabled: true},
		COUNT_REFURBISHED: {index: 13, deal: false, currency: false, isEnabled: true},
		COUNT_COLLECTIBLE: {index: 14, deal: false, currency: false, isEnabled: true},

		EXTRA_INFO_UPDATES: {index: 15, deal: false, currency: false, isEnabled: false},
		RATING: {index: 16, deal: false, currency: false, isEnabled: false},
		COUNT_REVIEWS: {index: 17, deal: false, currency: false, isEnabled: false},

		BUY_BOX_SHIPPING: {index: 18, deal: false, currency: true, isEnabled: false},
		USED_NEW_SHIPPING: {index: 19, deal: false, currency: true, isEnabled: false},
		USED_VERY_GOOD_SHIPPING: {index: 20, deal: false, currency: true, isEnabled: false},
		USED_GOOD_SHIPPING: {index: 21, deal: false, currency: true, isEnabled: false},
		USED_ACCEPTABLE_SHIPPING: {index: 22, deal: false, currency: true, isEnabled: false},
		COLLECTIBLE_NEW_SHIPPING: {index: 23, deal: false, currency: true, isEnabled: false},
		COLLECTIBLE_VERY_GOOD_SHIPPING: {index: 24, deal: false, currency: true, isEnabled: false},
		COLLECTIBLE_GOOD_SHIPPING: {index: 25, deal: false, currency: true, isEnabled: false},
		COLLECTIBLE_ACCEPTABLE_SHIPPING: {index: 26, deal: false, currency: true, isEnabled: false},
		REFURBISHED_SHIPPING: {index: 27, deal: false, currency: true, isEnabled: false},

		length: 28,

		getObject: function (index) {
			for (var entry in CsvType) {
				if (typeof CsvType[entry] == "object") {
					if (CsvType[entry].index == index)
						return CsvType[entry];
				}
			}
		},

		getObjectName: function (index) {
			for (var entry in CsvType) {
				if (typeof CsvType[entry] == "object") {
					if (CsvType[entry].index == index)
						return entry;
				}
			}
		}
	};

  function getProduct(domainId, ASIN, callback) {
    var url = endpoint + "product/?key=" + KEY + "&domain=" + domainId + "&asin=" + ASIN;
    var res = UrlFetchApp.fetch(url);
       pr = JSON.parse(res.getContentText());
    Logger.log(pr.products[0].stats);
       pr.products[0].stats = calculateStatistics(pr.products[0]);
       //callback(pr);
    return pr;
    
  }
  
/*
  function getProduct(domainId, ASIN, callback) {
		var url = endpoint + "product/?key=" + KEY + "&domain=" + domainId + "&asin=" + ASIN;
		httpGet(url, function (pr) {
			if (pr == null) callback(null);
			else {
				pr.products[0].stats = calculateStatistics(pr.products[0]);
				callback(pr);
			}
		});
	}

	function httpGet(url, callback) {
		var xhr = new XMLHttpRequest();
		if (callback) xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					callback.call(this, JSON.parse(xhr.responseText));
				} else callback.call(this, null);
			}
		};
		xhr.open("GET", url, true);
		xhr.send();
	}
  
  */

	function calculateStatistics(product) {
		function statsCSV(csv, id) {
			if (csv == null) return;
            var offset = 129384E7
            var hoursOrMinutes = 60
            var offsetHours = offset / 36E5
			var highest = {date: 0, val: 0};
			var lowest = {date: 0, val: 99999999999};
			var avg = {days: 90, val: -1, count: 0, dropsVal: 0}, current = {date: 0, val: 0};
			var now = (Date.now() / 3600000).toFixed(0) - offsetHours;
			var hoursSinceFirstRecord = now - (csv[0] / 60);

			if (hoursSinceFirstRecord < 24 * 90)
				avg.days = Math.floor(hoursSinceFirstRecord / 24);

			var previousValue = -1;
			for (var i = 1, j = csv.length; i < j; i = i + 2) {
				if (id == CsvType.RATING.index) {
					csv[i] /= 10;
				}

				var c = csv[i];

				if (c != '' && c != -1) {
					if (lowest.val >= c) {
						lowest.val = Number(c);
						lowest.date = Number(csv[i - 1]) / 60;
					}

					if (highest.val <= c) {
						highest.val = Number(c);
						highest.date = Number(csv[i - 1]) / 60;
					}

					if (hoursSinceFirstRecord < 24)
						continue;

					if (now - (Number(csv[i - 1] / hoursOrMinutes)) < avg.days * 24) {

						if (i == 1) {
							continue;
						}

						if (c != -1 && c < previousValue) {
							avg.dropsVal++;
						}

						previousValue = c;

						if (avg.val == -1) {
							if (csv[i - 2] == -1) {
								avg.val = 0;
							} else {
								var count = (avg.days * 24 * hoursOrMinutes - (now * hoursOrMinutes - Number(csv[i - 1]))) / 24;
								avg.count = count;
								avg.val = Number(csv[i - 2]) * count;
							}
						}

						if (i + 1 == j) {
							if (csv[i - 2] == -1) {
								continue;
							}
							var count = ((now * hoursOrMinutes - Number(csv[j - 2])) / 24);
							avg.count += count;
							avg.val += count * Number(c);
						} else {
							var count = ((Number(csv[i + 1]) - Number(csv[i - 1])) / (24));
							avg.count += count;
							avg.val += Number(c) * count;
						}
					} else {
						previousValue = c;
						if (i == j - 1 && csv[i] != -1) {
							avg.count += 1;
							avg.val = Number(csv[i]);
						}
					}
				}
			}

			if (avg.val != -1) {
				if (avg.count != 0) {
					avg.val = avg.val / avg.count;
				} else {
					avg.val = -1;
				}
			}

			if (avg.dropsVal > 0) {
				avg.dropsVal = Math.round((avg.dropsVal / avg.days) * 3000.5) / 100;
				if (avg.dropsVal < 5)
					avg.dropsVal = avg.dropsVal.toFixed(1);
				else
					avg.dropsVal = avg.dropsVal.toFixed(0);
			}

			current.val = csv[csv.length - 1];
			current.date = csv[csv.length - 2] / 60;

			return {
				highest: highest.val == 0 ? -1 : highest,
				current: current.val < 1 ? -1 : current,
				avg: avg.val < 1 ? -1 : avg,
				avgDrops: avg.dropsVal,
				lowest: lowest.val == 99999999999 ? -1 : lowest,
				pctToAvg: avg.val < 1 ? -1 : avg.val
			}
		}

		var stats = {};
		for (var id in product.csv)
			stats[id] = statsCSV(product.csv[id], id);

		return stats;
	}

	return {
		getProduct: getProduct,
		CsvType: CsvType
	}
})();

