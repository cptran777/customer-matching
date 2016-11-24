'use strict'
// This file contains the function to read the recipient csv file and populate the r Tree

/******************* INIT DEPENDENCIES *********************/

let fs = require('fs');
let path = require('path');
let parse = require('csv-parse');

module.exports = (rTree) => {

	let csvData = [];

	fs.createReadStream(path.resolve(__dirname + '/../resources/Recipients.csv'))
	    .pipe(parse({columns: true}))
	    .on('data', function(csvrow) {
	        csvData.push(csvrow);        
	    })
	    .on('end',function() {
	    	for (let x = 0; x < csvData.length; x++) {
	    		csvData[x].coordX = -(parseFloat(csvData[x].Longitude) + 122) * 100
	    		csvData[x].coordY = (parseFloat(csvData[x].Latitude) - 37) * 100
	    		if (x < 10) {
	    			console.log(csvData[x]);
	    		}
	    	}
	    });

};