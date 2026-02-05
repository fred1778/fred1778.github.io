
const refs = [
    {
        "id": 1,
        "parkeringsplads": "Volmers Plads",
        "latitude": "55.7105151026069",
        "longitude": "9.53743345140249"
    },
    {
        "id": 3,
        "parkeringsplads": "Willy Sørensens Plads",
        "latitude": "55.7064233390126",
        "longitude": "9.51916160005102"
    },
    {
        "id": 4,
        "parkeringsplads": "Kirketorvet",
        "latitude": "55.7073019571637",
        "longitude": "9.53481634366529"
    },
    {
        "id": 8,
        "parkeringsplads": "P-hus Cronhammar",
        "latitude": "55.70362962624377",
        "longitude": "9.53797489687106"
    },
    {
        "id": 9,
        "parkeringsplads": "P-hus Trondur",
        "latitude": "55.71024187157067",
        "longitude": "9.537487041059126"
    },
    {
        "id": 10,
        "parkeringsplads": "P-hus Albert",
        "latitude": "55.711360112119706",
        "longitude": "9.533262437014844"
    },
    {
        "id": 11,
        "parkeringsplads": "Willy Sørensens Plads (Spole)",
        "latitude": "55.706433699654795",
        "longitude": "9.519322682371577"
    },
    {
        "id": 12,
        "parkeringsplads": "Maria Plads",
        "latitude": "55.708133397062696",
        "longitude": "9.530342094898124"
    },
    {
        "id": 13,
        "parkeringsplads": "Føtex Nørregade",
        "latitude": "55.710691429580265",
        "longitude": "9.5341030339801"
    },
    {
        "id": 14,
        "parkeringsplads": "Bryggen",
   
        "latitude": "55.70516768387989",
        "longitude": "9.530599558852131"
    },
    {
        "id": 15,
        "parkeringsplads": "Gunhilds Plads",
    
        "latitude": "55.71337035632404",
        "longitude": "9.535623980064438"
    },
    {
        "id": 16,
        "parkeringsplads": "Abelones Plads",
     
        "latitude": "55.71465520049069",
        "longitude": "9.535197276811372"
    },
    {
        "id": 17,
        "parkeringsplads": "Skolegade",
        
        "latitude": "55.711513573138404",
        "longitude": "9.528275338205685"
    }
]







function spaceHistory(data, id){
    console.log(id)
    let results = data.filter((row) => row[1] == id)

    results.reverse()
    let twenty = results.slice(0, 50)

    return twenty.reverse()
//             let lots = refs.filter((ref) => ref.id == row[1])


}

const url ='https://fcgtest26.s3.eu-north-1.amazonaws.com/vejle_data.csv'

var results 


     mapboxgl.accessToken = 'pk.eyJ1IjoiZnJlZGRsZXMiLCJhIjoiY2tsODk3ZWp4MG56cTJwcjI0OXc4bWs4eSJ9.bhQgzXy1d1Fl81oGI8ktiA';
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/freddles/cmjxdi08x003701r03g1455q9', // Use the standard style for the map
        //projection: 'globe', // display the map as a globe
        zoom: 13, // initial zoom level, 0 is the world view, higher values zoom in
        center: [9.53516, 55.7116] // center the map on this longitude and latitude
    });

    map.addControl(new mapboxgl.NavigationControl());
    map.scrollZoom.disable();

    map.on('style.load', () => {
        map.setFog({}); // Set the default atmosphere style
    });


    var update = document.getElementById("udate")
    

    fetch(url)
  .then(res => res.blob()) // Gets the response and returns it as a blob
  .then(blob => 
    blob.text())
    .then(text => {
        let  results = Papa.parse(text)
       let  data = results['data']
        let  max = data.length -1 ;
        let  min = data.length - 13;
        console.log(max)
        console.log(min)

        let ts = data[max-1][0]
        let date = new Date(ts).toLocaleTimeString()

        
        let udatestr = `Data Last Updated:  ` +  date
        update.textContent = udatestr
        console.log(ts)


        var tot_aggr = 0
        var occ_aggr = 0
        var tot_pc = 0

   

        for(let i = max; i >= min; i--){
        
            let row = data[i]
            if(row[0] !== ""){
             let lots = refs.filter((ref) => ref.id == row[1])
             var lot
              let id_str = '\"' + row[1] + '\"'
             lots.forEach((element) => {
                lot = element
             }
            );
            if(lot !== undefined){

             // build custom marker - colour and stats
                let occ = Number(row[2])
                let empty = Number(row[3])
                let total = occ + empty
                tot_aggr += total
                occ_aggr += occ

                let pc_full = Math.round((occ / total) * 100)
                console.log(pc_full + "%") 
                tot_pc += pc_full
                

                let space_str = empty + " free spaces"
                let pc_str = pc_full +  "%"


                var rgb = [0, 255, 0]
        
                 if(pc_full <= 50){

                    rgb[0] = Math.round(255 * (pc_full / 50))

                  } else {
                    rgb[0] = 255
                    rgb[1] = 255 - (255 * ((pc_full - 50)/ 50))
                   }

                      console.log(rgb[0])
                    console.log(rgb[1])

                color_hex  = "#"


                var rgb_str = '"color:rgb('

                function rgbStrMake(value, index, array){
                    rgb_str += Math.round(value).toString()
                    rgb_str += ' '

                }
                  rgb.forEach(rgbStrMake)
                  rgb_str += ')"'

                console.log(rgb_str)

           

                
                colrHexStyle = rgb_str




                const el = document.createElement('div');
                el.id = i
                el.className = 'cp_mark';
                el.innerHTML = `
                <span class="marker-label">` + lot.parkeringsplads + `</span>
                <div id="dline">
                <p class="spaces">` + space_str + `</p>
                <p class="occ-detail" id=` + id_str + `style=` + colrHexStyle + `>` + pc_str + `</p>
                 </div>
                `;
                console.log(el.innerHTML)
                el.addEventListener("click", () => {
                        console.log("click on")

                        let dta = data[el.id]
                        console.log(dta)

                        let hist = spaceHistory(data, dta[1])


                          let all_lots = refs.filter((ref) => ref.id == dta[1])
                             var thisLot
                              let id_str = '\"' + row[1] + '\"'
                              all_lots.forEach((element) => {
                                  thisLot = element
                              })

                        let spaces = Number(dta[2]) + Number(dta[3])
                        let dtl = document.getElementById("detail")
                        dtl.style.display = "flex"
                        document.getElementById("dtl_title").textContent = thisLot.parkeringsplads
                        document.getElementById("space_info").textContent = "Total spaces: " + spaces + ",  " + dta[2] + " available"

                        let ch_container = document.getElementById("avg1").children



                        
                        for(let s = 0; s < 50; s++){


                            let k =  hist[s][2] / spaces
                            let height = k * 100

                            let pc = Math.round(k * 100)

                            var rgb = [0, 255, 0]
        
                             if(pc <= 50){

                              rgb[0] = Math.round(255 * (pc / 50))

                  } else {
                    rgb[0] = 255
                    rgb[1] = 255 - (255 * ((pc - 50)/ 50))
                   }
       var rgb_str = 'rgb('

                function rgbStrMake(value, index, array){
                    rgb_str += Math.round(value).toString()
                    rgb_str += ' '

                }
                  rgb.forEach(rgbStrMake)
                  rgb_str += ')'

                            console.log(rgb_str)
                            let height_str = height.toString() + "px"
                            ch_container[s].style.height=height_str;
                            ch_container[s].style.background=rgb_str
                        };

                });
   

                // create a marker at a coordinate
                const marker = new mapboxgl.Marker({
                    element: el
                })
                .setLngLat([lot.longitude, lot.latitude])
                .addTo(map);
            }



        }

        }

        let overall = document.getElementById("overall")
        let avocc = document.getElementById("av_occ")


        let ov_pc = Math.round((occ_aggr / tot_aggr) * 100)
        let av_pc = Math.round(tot_pc / 12)
        console.log(tot_aggr)
        overall.textContent = "Occupied spaces: " + ov_pc + "%"
        avocc.textContent = "Average car park occupancy: " + av_pc + "%"

    })