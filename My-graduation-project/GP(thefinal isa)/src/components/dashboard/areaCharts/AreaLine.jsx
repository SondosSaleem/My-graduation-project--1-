import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { LineChart } from '@mui/x-charts/LineChart';
import { colors } from '@mui/material';

export default function AreaLine() {
  const [data, setData] = useState({ xData: [], yData: [] });

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      console.log(jsonData); // Log parsed data

      // Ensure the 'date' column exists and is correctly parsed
      const xData = jsonData.map(row => new Date(row['date']));
      const yData = jsonData.map(row => Number(row['Profit']));

      setData({ xData, yData });
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className='linechart'>
      <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />
      <LineChart className='chart'
        xAxis={[{ data: data.xData, type: 'category', tickFormatter: (date) => new Date(date).toLocaleDateString() }]}
        series={[
          {
            data: data.yData,
            area: true,
          },
        ]}
        width={700}
        height={400}
      />
    </div>
  );
}
