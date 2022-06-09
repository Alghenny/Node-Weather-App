require('dotenv').config();

const { readInput, inquirerMenu, pause, listPlaces } = require("./helpers/inquirer");
const Search = require("./models/search");


const main = async() => {

    const search = new Search();
    let opt;

    do {
        
        opt = await inquirerMenu();

        switch ( opt ) {
            case 1:
                //Show message
                const query = await readInput('Ciudad: ');
                //search place
                const places = await search.city( query );
                
                //Select the place
                const id = await listPlaces(places);
                if( id === 0 ) continue;

                const { name, lon, lat } = places.find( place => place.id === id );
                
                search.regHistory( name );

                // Weather
                const { desc, min, max, temp } = await search.cityWeather( lat, lon )
                
                // Show Result
                console.log('\n Informacion de la ciudad\n'.green);
                console.log('Ciudad:', name);
                console.log('Lat:', lat);
                console.log('Lon:', lon);
                console.log('Temperatura:', temp,'°C'.yellow);
                console.log('Min:', min,'°C'.yellow);
                console.log('Max:', max,'°C'.yellow);
                console.log('Estado del Clima:', desc.green);
            break;
            
            case 2:
                console.log('\n');
                search.history.forEach( (place, i) => {
                    const index = `${i + 1}.`.green;
                    console.log(`${index} ${place}`);
                })
            break;
        
        }

        if( opt !== 0 ) await pause();

    } while ( opt !== 0);

}

main()