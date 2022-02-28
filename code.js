let eventCount = {};
let correlacionEvents = {};

var getData  =  new Promise(resolve =>{
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json');
        xhr.responseType = 'json';
        xhr.send();
    
        xhr.onload = () => {
            const data = xhr.response;
            //callback(data);
            resolve(data);
        };
    });
    



async function loadTableCorrelations(){
    const tableCor = document.getElementById('tableCorrelation');
    let htmlT = '';
    let counter = 0;
    for(key in correlacionEvents){
        htmlT += `<tr><td>${counter}</td><td>${key}</td><td>${correlacionEvents[key]}</td></tr>`;   
        counter++;
    }
    tableCor.innerHTML = htmlT;
}

function loadData2Table(events){
    const table = document.getElementById('tableData');
    let dataHtml = '';
    let counter = 0;
    let theEvents = []; 

    for(let event of events){
        // Calcula TP y FN
        if(event.squirrel){
            dataHtml += `<tr bgcolor="#F08080"><td>${counter}</td><td>${event.events}</td><td>${event.squirrel}</td></tr>`;
            for (e of event.events){
                if(!(theEvents.includes(e))){
                    theEvents.push(e);
                    let temp = {};
                    temp['tp'] = 1;
                    temp['fp'] = 0;
                    temp['tn'] = 0;
                    temp['fn'] = 0;
                    eventCount[e] = temp;

                }else{
                    eventCount[e]['tp']++;
                }
            }

        }else{
            for (e of event.events){
                if(!(theEvents.includes(e))){
                    theEvents.push(e);
                    let temp = {};
                    temp['tp'] = 0;
                    temp['fp'] = 0;
                    temp['tn'] = 0;
                    temp['fn'] = 1;
                    eventCount[e] = temp;
                }else{
                    eventCount[e]['fn']++;
                }
            }
            dataHtml += `<tr><td>${counter}</td><td>${event.events}</td><td>${event.squirrel}</td></tr>`;
            
        }
        
        counter++;
        
    }

    // Calcular TN y FP
    for(let event of events){
        let difference = theEvents.filter(x => !event.events.includes(x));
        if(event.squirrel){
            for (e of difference){
                eventCount[e]['fp']++;
            }
        }else{
            for (e of difference){
                eventCount[e]['tn']++;
            }
        }
        

    }

    for(let key in eventCount){
        let tp = eventCount[key]['tp'];
        let tn = eventCount[key]['tn'];
        let fp = eventCount[key]['fp'];
        let fn = eventCount[key]['fn'];
        
        let result = calculate(tp,tn,fp,fn);
        correlacionEvents[key] = result;
    }
    //console.log(theEvents);
    //console.log(eventCount);
    //console.log(correlacionEvents);
    table.innerHTML = dataHtml;    

}


function calculate(tp,tn,fp,fn){
    let result = (tp*tn - fp*fn)/Math.sqrt((tp+fp)*(tp+fn)*(tn+fp)*(tn+fn));
    return result;
}


getData
.then(loadData2Table)
.then(loadTableCorrelations)
//loadTableCorrelations();