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
      airQuality: { pm2_5: rawData.current.air_quality.pm2_5, pm10:  rawData.current.air_quality.pm10, o3:  rawData.current.air_quality.o3, no2:  rawData.current.air_quality.no2, so2:  rawData.current.air_quality.so2, co:  rawData.current.air_quality.co },
    },
  };

  const secondStep = [
  {"date": rawData.slice(1,3).forecast},
  // { "date": "2025-01-02", "min": -20.1, "max": -8, "condition": "Sunny" },
  // { "date": "2025-01-03", "min": -19, "max": -7.5, "condition": "Snow showers" }
]
console.log(secondStep);


  return {
    // task_1: taskOne,
    task_2: secondStep,
    // task_3: thirdStep,
  };
};

const main = async () => {
  const rawData = await getWeatherData();

  console.dir(parseWeather(rawData), { depth: 20 });
};

main();
