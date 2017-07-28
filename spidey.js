const 	request = require("request"),
		cheerio = require("cheerio"),
		globalLinks = [],
		fs = require("fs"),
		countryNames=[];
var globalData={};

const url = "https://www.usembassy.gov/";

request(url,function(err,response,body) {
	if(!err) {
		var $  = cheerio.load(body);

		// var $listwrap = $(".listwrap a");
		$("a.title","div.listwrap").each(function(){
			globalLinks.push($(this).attr("href"));
			countryNames.push(this.children[0].data);
			// console.log($(this).attr('href'));
		});

		var len = globalLinks.length;
		func1(len);
		function func1(n) {
			if(n == 0) {
				// console.log(globalData);
				globalData = JSON.stringify(globalData);
				fs.writeFile("globalData.json", globalData, 'utf8', function (err) {
				    if (err) {
				        return console.log(err);
				    }
				    console.log("The file was saved!");
				}); 
				return;
			}
			func2(globalLinks[n-1]);
			var tempArray=[];
			function func2(url) {
				var name = countryNames[n-1];
				request(url,function(err,response,body) {
					if(!err){
						var $ = cheerio.load(body);
						$("a","div.cityname").each(function(){
							if(!(this.next == null || this.next.next == null)) {
								tempArray.push(this.next.next.data);
							}
							// tempArray.push(this.next.next.data);
						});
						// console.log(tempArray);
						globalData[name] = tempArray;
						func1(n-1);
					}
				});
			}
		}
	}
});