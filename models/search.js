const fs = require('fs');

const axios = require('axios');
const { capitalizeFirstLetter } = require('../helpers/commonUtils');

class Search{

    history = [];
    dbPath = './db/database.json';

    constructor() {
        this.readDB();
    }

    get paramsMapBox(){
        return {
            'access_token': process.env.MAPBOX_KEY,
            'language': 'es'
        }
    }

    async city( place = '' ){

        try {
            //http
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
                params: this.paramsMapBox
            });

            const resp = await instance.get();

            return resp.data.features.map( place => ({
                id: place.id,
                name: place.place_name,
                lon: place.center[0],
                lat: place.center[1]
            }))

        } catch (error) {
            throw error
        }

    }

    get paramsOpenWeather(){
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }

    async cityWeather( lat, lon ) {

        try {
            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: { lat, lon, ...this.paramsOpenWeather }
            });
    
            const { data:resp} = await instance.get();
            const { temp, temp_min, temp_max } = resp.main;
            const desc = capitalizeFirstLetter(resp.weather[0].description);
           
            return ({
                desc,
                min: temp_min,
                max: temp_max,
                temp: temp
            })

        } catch (error) {
            throw error
        }

    }

    regHistory( place = '') {

        if( this.history.includes( place )){
            return;
        }

        this.history = this.history.splice(0,4);

        this.history.unshift( place );

        this.saveDB();

    }

    saveDB() {
        const payload = {
            history: this.history
        }

        fs.writeFileSync(this.dbPath, JSON.stringify( payload ));
    }

    readDB() {

        if( !fs.existsSync( this.dbPath )) return null;

        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
        const { history } = JSON.parse( info );
        
        this.history = [...history]

    }

}

module.exports = Search;