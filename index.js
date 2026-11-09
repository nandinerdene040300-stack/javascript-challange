const getWeatherData = async () => {
  try {
    const res = await fetch("https://pub-54904ef3b9374b6c9f80cf1763a31f5b.r2.dev/cc-datas/weather-data.json");

    if (!res.ok) {
      console.log("Дата авахад алдаа гарлаа");
      return null;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Дата авахад алдаа гарлаа", error);
    return null;
  }
};
const parseWeather = (rawData) => {
  if (!rawData) return;
  const taskOne = {
    city: rawData.location.name,
    country: rawData.location.country,
    current: {
      temp: rawData.current.temp_c,
      condition: rawData.current.condition.text,
      humidity: rawData.current.humidity,
      airQuality: {
        pm2_5: rawData.current.air_quality.pm2_5,
        pm10: rawData.current.air_quality.pm10,
        o3: rawData.current.air_quality.o3,
        no2: rawData.current.air_quality.no2,
        so2: rawData.current.air_quality.so2,
        co: rawData.current.air_quality.co,
      },
    },
  };

  const forecastDays = rawData.forecast.forecastday;

  const task2 = forecastDays.slice(0, 3).map((day) => {
    const d = day.day || day;
    return {
      date: day.date || null,
      min: d.mintemp_c ?? d.minTemp ?? d.min ?? null,
      max: d.maxtemp_c ?? d.maxTemp ?? d.max ?? null,
      condition: d.condition?.text || d.condition || null,
    };
  });

  const today = rawData.forecast.forecastday[0].hour;
  const { maxWind, hourCount, sumTemp, precipTotal } = today.reduce(
    (acc, hour) => {
      const temp = hour.temp_c ?? hour.feelslike_c;

      if (temp !== null && temp !== undefined) {
        acc.sumTemp += temp;
        acc.hourCount += 1;
      }

      if (typeof hour.wind_kph === "number") {
        acc.maxWind = Math.max(acc.maxWind, hour.wind_kph);
      }

      if (typeof hour.precip_mm === "number") {
        acc.precipTotal += hour.precip_mm;
      }

      return acc;
    },
    {
      maxWind: 0,
      hourCount: 0,
      sumTemp: 0,
      precipTotal: 0,
    },
  );

  const convertIntoDecimal = (x) => Math.round(x * 10) / 10;

  const thirdStep = { date: rawData.forecast.forecastday[0].date, avgTemp: convertIntoDecimal(sumTemp / hourCount), maxWind, precipTotal: convertIntoDecimal(precipTotal) };

  return {
    task_1: taskOne,
    task_2: task2,
    task_3: thirdStep,
  };
};

const main = async () => {
  const rawData = await getWeatherData();

  console.dir(parseWeather(rawData), { depth: 20 });
};

main();
