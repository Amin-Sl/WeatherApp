import React, { useMemo } from 'react';
import '../css/DetailsCard.css';
import { useTranslation } from 'react-i18next';
import convertToFahrenheit from '../helpers/convertToFahrenheit';
import CloudsCard from './CloudsCard';
import MoreInfoCard from './MoreInfoCard';

function Testt({
  weather_icon,
  data,
  soundEnabled,
  isFahrenheitMode,
  degreeSymbol,
}) {
  const { clouds, main, weather } = data.list[0];
  const { t } = useTranslation();

   const formattedData = useMemo(() => {
    return {
      temp: Math.round(
        isFahrenheitMode ? convertToFahrenheit(main.temp) : main.temp
      ),
      feels_like: Math.round(
        isFahrenheitMode
          ? convertToFahrenheit(main.feels_like)
          : main.feels_like
      ),
      temp_min: Math.round(
        isFahrenheitMode ? convertToFahrenheit(main.temp_min) : main.temp_min
      ),
      temp_max: Math.round(
        isFahrenheitMode ? convertToFahrenheit(main.temp_max) : main.temp_max
      ),
    };
  }, [
    isFahrenheitMode,
    main.feels_like,
    main.temp,
    main.temp_max,
    main.temp_min,
  ]);

  return (
    <>
      <MoreInfoCard data={{ formattedData, degreeSymbol, main, clouds, t }} />
    </>
  );
}
export default Testt;
