const fetchTimeZone = async () => {
    const timeZoneJsonfetch = await fetch("timezone.json");
    const data = await timeZoneJsonfetch.json();
    return data;
}


(async () => {
    const data = await fetchTimeZone();

    let arr = new Array();
    data.forEach(element => {
        arr.push(element.name);
    })

    function removeDuplicates(arr) {
        return [...new Set(arr)];
    }

    let x = removeDuplicates(arr);

    let seletBar = document.getElementById("country");

    x.forEach(element => {
        let option = document.createElement("option");
        option.innerHTML = element;
        seletBar.appendChild(option);
    });

})();

const getTimeZone = async () => {
    let searchBarSelectedItem = document.getElementById("country");
    let selectedCountry = searchBarSelectedItem.options[searchBarSelectedItem.selectedIndex].text;
    let region;

    let timeZoneJsonfetch = await fetchTimeZone();

    await timeZoneJsonfetch.forEach(element => {
        if (element.name == selectedCountry) {
            region = element.timezone;
        }
    })

    return region;
}


let btn = document.getElementById("btnGetTime");
let x;

btn.addEventListener("click", () => {
    if (x) {
        clearInterval(x);
    }
})

const getWeather = async (city) => {

    const url = 'https://the-weather-api.p.rapidapi.com/api/weather/' + city;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '947d044ee2mshcfd3b07e7cc2b56p153e81jsnfe04c9624451',
            'X-RapidAPI-Host': 'the-weather-api.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    } catch (error) {
        return error;
    }
}


btn.addEventListener("click", async () => {

    let region = await getTimeZone();
    let clock = document.getElementById("clock");
    let divdate = document.getElementById("date");
    let temperature = document.getElementById("temp");

    clock.innerHTML = "";
    divdate.innerHTML = "";
    temperature.innerHTML = "";

    let spinnerDisplayer = document.querySelector('.spinner-displayer');
    spinnerDisplayer.classList.add('loading');

    let temp = await getWeather(region.split("/")[1]);

    function interval() {
        let d = new Date();
        let t = d.toLocaleString("en-US", { timeZone: region });

        let day = t.split(" ")[0].split("/")[1];
        let mnth = t.split(" ")[0].split("/")[0];
        let year = t.split(" ")[0].split("/")[2];

        let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        let finaldate = day + " " + month[mnth - 1] + " " + year.slice(0, -1);

        let amPm = t.split(" ")[2];

        let h = t.split(" ")[1].split(":")[0];
        let m = t.split(" ")[1].split(":")[1];
        let s = t.split(" ")[1].split(":")[2];

        let finalTime = h + ":" + m + ":" + s + " " + amPm;

        clock.innerHTML = finalTime;
        divdate.innerHTML = finaldate;
        temperature.innerHTML = "Temperature: " + temp.data.temp + "&deg <br>" + "Current Weather: " + temp.data.current_weather;
    }

    x = setInterval(interval, 1000);
    spinnerDisplayer.classList.remove('loading'); 
})