/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9117647058823529, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "savePurchase-112"], "isController": false}, {"data": [1.0, 500, 1500, "savePurchase-134"], "isController": false}, {"data": [1.0, 500, 1500, "savePurchase-133"], "isController": false}, {"data": [1.0, 500, 1500, "savePurchase-132"], "isController": false}, {"data": [1.0, 500, 1500, "savePurchase-131"], "isController": false}, {"data": [1.0, 500, 1500, "savePurchase-115"], "isController": false}, {"data": [0.0, 500, 1500, "saveLogin"], "isController": true}, {"data": [1.0, 500, 1500, "saveLogin-63"], "isController": false}, {"data": [1.0, 500, 1500, "savePurchase-113"], "isController": false}, {"data": [0.375, 500, 1500, "savePurchase"], "isController": true}, {"data": [1.0, 500, 1500, "getLandingPage-32"], "isController": false}, {"data": [1.0, 500, 1500, "getLandingPage-33"], "isController": false}, {"data": [0.5, 500, 1500, "selectSpesificItem"], "isController": true}, {"data": [1.0, 500, 1500, "goToCart-110"], "isController": false}, {"data": [1.0, 500, 1500, "selectLaptopsPage-64"], "isController": false}, {"data": [1.0, 500, 1500, "getLandingPage-31"], "isController": false}, {"data": [1.0, 500, 1500, "saveLogin-55"], "isController": false}, {"data": [1.0, 500, 1500, "saveLogin-54"], "isController": false}, {"data": [1.0, 500, 1500, "selectLaptopsPage"], "isController": true}, {"data": [1.0, 500, 1500, "saveLogin-35"], "isController": false}, {"data": [1.0, 500, 1500, "saveLogin-34"], "isController": false}, {"data": [0.0, 500, 1500, "getLandingPage-4"], "isController": false}, {"data": [1.0, 500, 1500, "saveLogin-36"], "isController": false}, {"data": [1.0, 500, 1500, "goToCart-109"], "isController": false}, {"data": [1.0, 500, 1500, "saveLogin-53"], "isController": false}, {"data": [0.0, 500, 1500, "getLandingPage"], "isController": true}, {"data": [1.0, 500, 1500, "saveLogin-52"], "isController": false}, {"data": [1.0, 500, 1500, "selectLaptopsPage-65"], "isController": false}, {"data": [0.875, 500, 1500, "addItemToCart"], "isController": true}, {"data": [1.0, 500, 1500, "getLandingPage-22"], "isController": false}, {"data": [1.0, 500, 1500, "selectMaCBookLaptop-85"], "isController": false}, {"data": [1.0, 500, 1500, "getLandingPage-23"], "isController": false}, {"data": [1.0, 500, 1500, "selectMaCBookLaptop-82"], "isController": false}, {"data": [1.0, 500, 1500, "selectMaCBookLaptop-81"], "isController": false}, {"data": [1.0, 500, 1500, "selectMaCBookLaptop-84"], "isController": false}, {"data": [1.0, 500, 1500, "addLaptopToCart-87"], "isController": false}, {"data": [1.0, 500, 1500, "selectMaCBookLaptop-83"], "isController": false}, {"data": [1.0, 500, 1500, "addLaptopToCart-88"], "isController": false}, {"data": [1.0, 500, 1500, "goToCart-104"], "isController": false}, {"data": [1.0, 500, 1500, "selectMaCBookLaptop-68"], "isController": false}, {"data": [0.0, 500, 1500, "goToCart"], "isController": true}, {"data": [1.0, 500, 1500, "goToCart-108"], "isController": false}, {"data": [1.0, 500, 1500, "goToCart-89"], "isController": false}, {"data": [1.0, 500, 1500, "goToCart-107"], "isController": false}, {"data": [1.0, 500, 1500, "goToCart-106"], "isController": false}, {"data": [1.0, 500, 1500, "goToCart-105"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 114, 0, 0.0, 229.19298245614036, 66, 2411, 198.5, 247.5, 315.5, 2122.699999999989, 4.121326054734102, 24.351855669986623, 1.907793802646325], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["savePurchase-112", 4, 0, 0.0, 202.75, 188, 232, 195.5, 232.0, 232.0, 232.0, 0.2574831026713872, 0.11290030576118443, 0.12170099774702285], "isController": false}, {"data": ["savePurchase-134", 4, 0, 0.0, 213.75, 201, 245, 204.5, 245.0, 245.0, 245.0, 0.25854825156744876, 0.15376551289509405, 0.1204370273414776], "isController": false}, {"data": ["savePurchase-133", 4, 0, 0.0, 226.75, 212, 245, 225.0, 245.0, 245.0, 245.0, 0.2578981302385558, 0.39925098726627983, 0.09923033526756932], "isController": false}, {"data": ["savePurchase-132", 4, 0, 0.0, 189.75, 189, 191, 189.5, 191.0, 191.0, 191.0, 0.2583144979011947, 0.11326485308362932, 0.12083266063932839], "isController": false}, {"data": ["savePurchase-131", 4, 0, 0.0, 133.5, 79, 188, 133.5, 188.0, 188.0, 188.0, 0.258364552383413, 0.1385807914029195, 0.1140437282004909], "isController": false}, {"data": ["savePurchase-115", 4, 0, 0.0, 194.25, 192, 199, 193.0, 199.0, 199.0, 199.0, 0.256492465533825, 1.268873737576146, 0.12824623276691247], "isController": false}, {"data": ["saveLogin", 1, 0, 0.0, 1903.0, 1903, 1903, 1903.0, 1903.0, 1903.0, 1903.0, 0.5254860746190225, 5.425233184445612, 1.912584570415134], "isController": true}, {"data": ["saveLogin-63", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 2.923276805251641, 1.0705860229759299], "isController": false}, {"data": ["savePurchase-113", 4, 0, 0.0, 282.5, 250, 320, 280.0, 320.0, 320.0, 320.0, 0.2555420686130454, 0.07885868523605698, 0.11704026384718584], "isController": false}, {"data": ["savePurchase", 4, 0, 0.0, 1443.25, 1388, 1512, 1436.5, 1512.0, 1512.0, 1512.0, 0.23894862604540024, 2.105559755824373, 0.7623487903225807], "isController": true}, {"data": ["getLandingPage-32", 1, 0, 0.0, 66.0, 66, 66, 66.0, 66.0, 66.0, 66.0, 15.151515151515152, 92.41832386363636, 6.0813210227272725], "isController": false}, {"data": ["getLandingPage-33", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 1084.6513931492843, 0.8267829754601227], "isController": false}, {"data": ["selectSpesificItem", 4, 0, 0.0, 1184.5, 1166, 1191, 1190.5, 1191.0, 1191.0, 1191.0, 0.2410655095522208, 2.0293407799975896, 0.6749363436388839], "isController": true}, {"data": ["goToCart-110", 4, 0, 0.0, 205.25, 201, 211, 204.5, 211.0, 211.0, 211.0, 0.25716857400025717, 0.21033074289571813, 0.11414366883116883], "isController": false}, {"data": ["selectLaptopsPage-64", 4, 0, 0.0, 190.5, 188, 193, 190.5, 193.0, 193.0, 193.0, 0.2565253639453601, 0.11248035977682293, 0.11999575129865965], "isController": false}, {"data": ["getLandingPage-31", 1, 0, 0.0, 285.0, 285, 285, 285.0, 285.0, 285.0, 285.0, 3.5087719298245617, 4.944490131578948, 1.3603344298245614], "isController": false}, {"data": ["saveLogin-55", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 3.10546875, 2.3291015625], "isController": false}, {"data": ["saveLogin-54", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 2.3077713815789473, 2.461965460526316], "isController": false}, {"data": ["selectLaptopsPage", 4, 0, 0.0, 403.0, 402, 404, 403.0, 404.0, 404.0, 404.0, 0.25303643724696356, 0.4692540960273279, 0.23277375379554657], "isController": true}, {"data": ["saveLogin-35", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 1.8405843401486988, 1.7643471189591078], "isController": false}, {"data": ["saveLogin-34", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 2.2601884664948453, 2.411203286082474], "isController": false}, {"data": ["getLandingPage-4", 1, 0, 0.0, 2411.0, 2411, 2411, 2411.0, 2411.0, 2411.0, 2411.0, 0.41476565740356697, 2.15686242741601, 0.18591546557445043], "isController": false}, {"data": ["saveLogin-36", 1, 0, 0.0, 198.0, 198, 198, 198.0, 198.0, 198.0, 198.0, 5.050505050505051, 25.03057922979798, 2.2638494318181817], "isController": false}, {"data": ["goToCart-109", 4, 0, 0.0, 191.5, 187, 198, 190.5, 198.0, 198.0, 198.0, 0.257383694742938, 0.11285671771443279, 0.1201459043819574], "isController": false}, {"data": ["saveLogin-53", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 208.0, 4.807692307692308, 7.418118990384616, 1.8498347355769231], "isController": false}, {"data": ["getLandingPage", 1, 0, 0.0, 3900.0, 3900, 3900, 3900.0, 3900.0, 3900.0, 3900.0, 0.2564102564102564, 139.74083533653845, 0.6327624198717949], "isController": true}, {"data": ["saveLogin-52", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 187.0, 5.347593582887701, 2.652907754010695, 2.360461229946524], "isController": false}, {"data": ["selectLaptopsPage-65", 4, 0, 0.0, 212.5, 210, 215, 212.5, 215.0, 215.0, 215.0, 0.25619675911099726, 0.36277861397553324, 0.11583896432460129], "isController": false}, {"data": ["addItemToCart", 4, 0, 0.0, 453.25, 428, 504, 440.5, 504.0, 504.0, 504.0, 0.25271670457417234, 0.1868227982057114, 0.2558016252843063], "isController": true}, {"data": ["getLandingPage-22", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 2.1484375, 2.323190789473684], "isController": false}, {"data": ["selectMaCBookLaptop-85", 4, 0, 0.0, 201.75, 200, 204, 201.5, 204.0, 204.0, 204.0, 0.2563445270443476, 0.1650968902204563, 0.11941048769546271], "isController": false}, {"data": ["getLandingPage-23", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 3.2190393518518516, 0.8382693355119826], "isController": false}, {"data": ["selectMaCBookLaptop-82", 4, 0, 0.0, 190.0, 188, 192, 190.0, 192.0, 192.0, 192.0, 0.25655827079725485, 0.11249478866012444, 0.11976059906356232], "isController": false}, {"data": ["selectMaCBookLaptop-81", 4, 0, 0.0, 188.75, 187, 192, 188.0, 192.0, 192.0, 192.0, 0.25655827079725485, 0.13429221987043807, 0.11500024052337887], "isController": false}, {"data": ["selectMaCBookLaptop-84", 4, 0, 0.0, 205.5, 200, 210, 206.0, 210.0, 210.0, 210.0, 0.25621316935690497, 0.2138654360427876, 0.11371961471944658], "isController": false}, {"data": ["addLaptopToCart-87", 4, 0, 0.0, 195.5, 189, 213, 190.0, 213.0, 213.0, 213.0, 0.25655827079725485, 0.11249478866012444, 0.12101332499518953], "isController": false}, {"data": ["selectMaCBookLaptop-83", 4, 0, 0.0, 190.25, 189, 192, 190.0, 192.0, 192.0, 192.0, 0.25655827079725485, 0.11249478866012444, 0.12001114424988776], "isController": false}, {"data": ["addLaptopToCart-88", 4, 0, 0.0, 257.75, 234, 314, 241.5, 314.0, 314.0, 314.0, 0.25577082933691414, 0.0769310697614937, 0.13825112699021677], "isController": false}, {"data": ["goToCart-104", 4, 0, 0.0, 192.0, 187, 206, 187.5, 206.0, 206.0, 206.0, 0.2571024553284484, 0.14800966544543, 0.11323555405579123], "isController": false}, {"data": ["selectMaCBookLaptop-68", 4, 0, 0.0, 208.25, 196, 219, 209.0, 219.0, 219.0, 219.0, 0.25621316935690497, 1.4191807583909812, 0.12998314597745325], "isController": false}, {"data": ["goToCart", 4, 0, 0.0, 1597.25, 1566, 1637, 1593.0, 1637.0, 1637.0, 1637.0, 0.2355435166647038, 2.2958592185843836, 0.8817930382169357], "isController": true}, {"data": ["goToCart-108", 4, 0, 0.0, 222.0, 219, 225, 222.0, 225.0, 225.0, 225.0, 0.2569703199280483, 0.17873741246948477, 0.12371715598098419], "isController": false}, {"data": ["goToCart-89", 4, 0, 0.0, 201.25, 193, 218, 197.0, 218.0, 218.0, 218.0, 0.256624109835119, 1.4748994554757169, 0.13006632129338552], "isController": false}, {"data": ["goToCart-107", 4, 0, 0.0, 204.25, 198, 208, 205.5, 208.0, 208.0, 208.0, 0.25715204114432655, 0.1530607119897139, 0.11978664416586307], "isController": false}, {"data": ["goToCart-106", 4, 0, 0.0, 189.5, 187, 191, 190.0, 191.0, 191.0, 191.0, 0.2574002574002574, 0.11286398005148006, 0.12115910553410554], "isController": false}, {"data": ["goToCart-105", 4, 0, 0.0, 191.5, 189, 195, 191.0, 195.0, 195.0, 195.0, 0.2573340195573855, 0.11283493630983016, 0.12037401891405043], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 114, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
