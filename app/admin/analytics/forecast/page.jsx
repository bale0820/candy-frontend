"use client";

import ForecastCharts from "@/features/administration/forecast/components/ForecastCharts";
import ForecastControls from "@/features/administration/forecast/components/ForecastControls";
import { exportForecastExcel } from "@/features/administration/forecast/exportForecastExcel";
import { getForecast, getSalesData } from "@/features/administration/forecast/forecastApi";
import useForecastExcelRows from "@/features/administration/forecast/useForecastExcelRows";
import { useEffect, useState } from "react";


export default function ForecastPage() {
  const [ppk, setPpk] = useState(4);
  const [sales, setSales] = useState([]);
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    const data = await getSalesData(ppk);
    console.log(data);
    setSales(data);
  };
  
  const runForecast = async () => {
    const result = await getForecast(ppk);
    console.log(result);
    setForecast(result);
  };
  console.log(forecast);
    // 🔥 forecast가 바뀔 때만 계산됨
  const excelRows = useForecastExcelRows(forecast);

  return (
    <div style={{ padding: 20 }}>
      <h1>📈 상품 판매량 예측</h1>

      <ForecastControls
        ppk={ppk}
        setPpk={setPpk}
        loadSales={loadSales}
        runForecast={runForecast}
        forecast={forecast}
        excelRows={excelRows}
        exportExcel={exportForecastExcel}
      />

      <ForecastCharts sales={sales} forecast={forecast} excelRows={excelRows} />
    </div>
  );
}
