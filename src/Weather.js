import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RiCelsiusFill, RiFahrenheitFill } from 'react-icons/ri';
import {
    TbMapSearch,
    TbMoon,
    TbSearch,
    TbSun,
    TbVolume,
    TbVolumeOff,
} from 'react-icons/tb';
import DetailsCard from './components/DetailsCard';
import SummaryCard from './components/SummaryCard';
// import LakeBackground from './asset/lake-background.jpg';
import BackgroundImage from './components/BackgroundImage';
import Animation from './components/Animation';

import axios from 'axios';
import { Card } from 'antd';
import Testt from './components/Test';

function WeatherApp() {
    const API_KEY = process.env.REACT_APP_API_KEY;
    const { t, i18n } = useTranslation();
    const [noData, setNoData] = useState();
    const [searchTerm, setSearchTerm] = useState('');
    const [weatherData, setWeatherData] = useState([]);
    const [city, setCity] = useState();
    const [weatherIcon, setWeatherIcon] = useState(
        `https://openweathermap.org/img/wn/10n@2x.png`
    );

    const [loading, setLoading] = useState(false);
    const [isFahrenheitMode, setIsFahrenheitMode] = useState(false);
    const degreeSymbol = useMemo(
        () => (isFahrenheitMode ? '\u00b0F' : '\u00b0C'),
        [isFahrenheitMode]
    );
    const [active, setActive] = useState(false);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        if (isDark) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [isDark]);

    useEffect(() => {
        if (
            window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches
        ) {
            setIsDark(true);
        }

        window
            .matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', (event) => {
                setIsDark(event.matches);
            });
    }, [setIsDark]);

    const toggleDark = () => {
        setIsDark((prev) => !prev);
    };

    const activate = () => {
        setActive(true);
    };


    const toggleFahrenheit = () => {
        setIsFahrenheitMode(!isFahrenheitMode);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        getWeather(searchTerm);
    };

    const getWeather = async (location) => {
        setLoading(true);
        setWeatherData([]);
        let how_to_search =
            typeof location === 'string'
                ? `q=${location}`
                : `lat=${location[0]}&lon=${location[1]}`;

        const url = 'https://api.openweathermap.org/data/2.5/forecast?';
        try {
            let res = await fetch(
                `${url}${how_to_search}&appid=${API_KEY}&units=metric&cnt=8&exclude=hourly,minutely`
            );
            let data = await res.json();
            if (data.cod !== '200') {
                setNoData('شهر مورد نظر یافت نشد');
                setCity('Unknown Location');
                setTimeout(() => {
                    setLoading(false);
                }, 500);
                return;
            }
            setWeatherData(data);
            setTimeout(() => {
                setLoading(false);
            }, 500);
            setCity(`${data.city.name}, ${data.city.country}`);
            setWeatherIcon(
                `${'https://openweathermap.org/img/wn/' + data.list[0].weather[0]['icon']
                }@4x.png`
            );
        } catch (error) {
            setLoading(true);
            console.log(error);
        }
    };
    const isRainyWeather = weatherData && weatherData.weather && weatherData.weather.length > 0 &&
        weatherData.weather[0].id >= 500 && weatherData.weather[0].id < 600;

    const [countries, setCountries] = useState([]);
    const [countryMatch, setCountryMatch] = useState([]);

    useEffect(() => {
        const loadCountries = async () => {
            const response = await axios.get("https://restcountries.com/v3.1/all");
            let arr = []
            response.data.forEach(element => {
                arr.push(element.name.official);
            });
            setCountries(arr);
            console.log(arr);
        };

        loadCountries();
    }, []);
    const searchCountries = (input) => {
        setSearchTerm(input);

        if (!input) {
            setCountryMatch([]);
        }

        else {
            let matches = countries.filter((country) => {
                const regex = new RegExp(`${input}`, "gi");
                return country.match(regex) || country.match(regex);
            });
            setCountryMatch(matches);
        }
    };



    return (
        <div className='container'>
            <div className='content'>
                <div
                    className='form-container'
                    // style={{
                    //     backgroundImage: `url(${weatherData ? BackgroundImage(weatherData) : LakeBackground
                    //         })`,
                    // }}
                >
                    <div className='name'>
                        <Animation />
                        <div className='toggle-containerr'>
                            <input
                                type='checkbox'
                                className='checkbox'
                                id='checkbox'
                                checked={isDark}
                                onChange={toggleDark}
                            />
                            <label htmlFor='checkbox' className='label'>
                                <TbMoon
                                    style={{
                                        color: '#a6ddf0',
                                    }}
                                />
                                <TbSun
                                    style={{
                                        color: '#f5c32c',
                                    }}
                                />
                                <div className='ball' />
                            </label>
                        </div>
                        <form className='search-bar' noValidate onSubmit={handleSubmit}>
                            <input
                                onClick={activate}
                                placeholder={active ? '' : 'جستجو'}
                                onChange={(e) => searchCountries(e.target.value)}
                                required
                                className="input_search"
                            />
                            <button className='s-icon'>
                                <TbSearch
                                    onClick={() => {
                                        navigator.geolocation.getCurrentPosition();
                                        //Note// زمانی که این تابع را فرا میخوانید به شما کمک میکند تا به موقعیت مکانی دستگاه فعلی دسترسی داشته باشید
                                    }}
                                />
                            </button>
                        </form>
                        <div className='city'>
                            <TbMapSearch />
                            <p>{city ?? t('unknown-location')}</p>
                        </div>
                    </div>
                    <div className='search'>
                        <div className='info-container'>
                            <div className='info-inner-container'>
                            </div>
                            {loading ? (
                                <div className='loader'></div>
                            ) : (
                                <span>
                                    {weatherData.length === 0 ? (
                                        <div className='nodata'>
                                            <h1>{noData ?? t('نام شهر خود را وارد کنید')}</h1>
                                            {noData === 'شهر مورد نظر یافت نشد' ? (
                                                <>

                                                </>
                                            ) : (
                                                <>
                                               
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            <div className='total'>
                                                <div className='view'>
                                                    <h1 className='centerTextOnMobile'>{t('today')}</h1>
                                                    <div className='toggle-container'>
                                                        <input
                                                            type='checkbox'
                                                            className='checkbox'
                                                            id='fahrenheit-checkbox'
                                                            onChange={toggleFahrenheit}
                                                        />
                                                        <label htmlFor='fahrenheit-checkbox' className='label'>
                                                            <RiFahrenheitFill />
                                                            <RiCelsiusFill />
                                                            <div className='ball' />
                                                        </label>
                                                    </div>
                                                    <DetailsCard
                                                        weather_icon={weatherIcon}
                                                        data={weatherData}
                                                        isFahrenheitMode={isFahrenheitMode}
                                                        degreeSymbol={degreeSymbol}
                                                    />
                                                </div>
                                                <div className='blocked'>
                                                    <h1 className='title centerTextOnMobile'>
                                                       {city ?? t('unknown-location')}
                                                    </h1>
                                                    <div className='more-details'>
                                                        <Testt
                                                            weather_icon={weatherIcon}
                                                            data={weatherData}
                                                            isFahrenheitMode={isFahrenheitMode}
                                                            degreeSymbol={degreeSymbol}
                                                        />
                                                    </div>
                                                    <ul className='summary'>
                                                        {weatherData.list.map((days, index) => (
                                                            <SummaryCard
                                                                key={index}
                                                                day={days}
                                                                isFahrenheitMode={isFahrenheitMode}
                                                                degreeSymbol={degreeSymbol}
                                                            />
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WeatherApp;
