import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactSpeedometer from 'react-d3-speedometer';
import DraggableSquare from './DraggableSquare';
const GaugeChart = ({ label, value, minValue, maxValue, unit }) => {
    return (
        <div style={{ textAlign: 'center', border: '10px solid #ccc', padding: '10px', position: 'relative' }}>
            <h2 style={{ fontSize: '1.5 em', fontWeight: 'bold', marginTop: '0px' }}>{label}</h2>
            <ReactSpeedometer
                value={value}
                minValue={minValue}
                maxValue={maxValue}
                needleColor="red"
                startColor="green"
                segments={10}
                endColor="red"
                needleHeightRatio={1}
                label={label}
                width={400} // Điều chỉnh kích thước của biểu đồ
                height={300}
            />
            <div style={{ position: 'absolute', bottom: '0px', left: '50%', transform: 'translateX(-50%)', fontSize: '1.5em', color: 'red', fontWeight: 'bold', marginBottom: '20px' }}>
                <span>{value}</span> <span>{unit}</span>
            </div>
        </div>
    );
};

const App = () => {
    const [gaugesData, setGaugesData] = useState({
        taytrai: 0,
        cangtaytrai: 0,
        tayphai: 0,
        cangtayphai: 0,
        nhiptim: 0,
        spo2: 0,
        lucnamcv: 0,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            fetchData();
        }, 1000); // Thực hiện fetch data mỗi giây

        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('https://ap-southeast-1.aws.data.mongodb-api.com/app/data-tqlme/endpoint/GETGAUSE');
            const data = response.data;

            setGaugesData({
                nhiptim: data[0]?.public?.output?.jsonData?.nhiptimK || 0,
                spo2: data[0]?.public?.output?.jsonData?.spo2K || 0,
                lucnamcv: data[0]?.public?.output?.jsonData?.lucnamcv || 0,
                taytrai_đ: data[0]?.public?.output?.jsonData?.taytrai_goc_đ || 0,
                cangtaytrai_đ: data[0]?.public?.output?.jsonData?.cangtaytrai_đ || 0,
                tayphai_đ: data[0]?.public?.output?.jsonData?.tayphai_goc_đ || 0,
                cangtayphai_đ: data[0]?.public?.output?.jsonData?.cangtayphai_đ || 0,
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    //
    const getNhiptimStatus = () => {
        if (gaugesData.nhiptim <= 0) {
            return 'Chưa phát hiện được nhịp tim';
        } else if (gaugesData.nhiptim > 0 && gaugesData.nhiptim < 70) {
            return 'Nhịp tim thấp';
        } else if (gaugesData.nhiptim >= 70 && gaugesData.nhiptim < 140) {
            return 'Nhịp tim bình thường';
        } else {
            return 'Nhịp tim cao';
        }
    };

    const getSpo2Status = () => {
        if (gaugesData.spo2 <= 0) {
            return 'Chưa phát hiện SPO2';
        } else if (gaugesData.spo2 < 95) {
            return 'Spo2 thấp';
        } else {
            return 'SPO2 bình thường';
        }
    };

    const getLucnamcvStatus = () => {
        if (gaugesData.lucnamcv <= 0) {
            return 'Chưa phát hiện lực nắm';
        } else if (gaugesData.lucnamcv > 0 && gaugesData.lucnamcv < 2000) {
            return 'Lực nắm thấp';
        } else {
            return 'Lực nắm bình thường';
        }
    };

    // 



    return (
        <div>
            <div className="enlarged-form">
                <DraggableSquare />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                <div>
                    <GaugeChart
                        label="NHỊP TIM"
                        value={gaugesData.nhiptim}
                        minValue={0}
                        maxValue={150}
                        unit="BPM"
                    />
                </div>
                <div>
                    <GaugeChart
                        label="TỈ LỆ OXI TRONG MÁU"
                        value={gaugesData.spo2}
                        minValue={0}
                        maxValue={100}
                        unit="%"
                    />
                </div>
                <div>
                    <GaugeChart
                        label="LỰC NẮM TAY"
                        value={gaugesData.lucnamcv}
                        minValue={0}
                        maxValue={10000}
                        unit="Gram"
                    />
                </div>
                {/* Hiển thị thông tin nhịp tim, tỉ lệ oxi trong máu, và lực nắm tay */}
                <div style={{ textAlign: 'center', border: '10px solid #ccc', padding: '10px', position: 'relative' }}>
                    <h2 style={{ fontSize: '1.5em', fontWeight: 'bold', marginTop: '0px' }}>STATUS</h2>
                    <div>
                        <p style={{ fontSize: '1.8em', fontWeight: 'bold', color: 'red', fontFamily: 'Times New Roman' }}>{getNhiptimStatus()}</p>
                        <p style={{ fontSize: '1.8em', fontWeight: 'bold', color: 'red', fontFamily: 'Times New Roman' }}>{getSpo2Status()}</p>
                        <p style={{ fontSize: '1.8em', fontWeight: 'bold', color: 'red', fontFamily: 'Times New Roman' }}>{getLucnamcvStatus()}</p>
                    </div>
                </div>



                <div>
                    <GaugeChart
                        label="TAY TRÁI"
                        value={gaugesData.taytrai_đ}
                        minValue={-360}
                        maxValue={360}
                        unit="Độ"
                    />
                </div>
                <div>
                    <GaugeChart
                        label="TAY PHẢI"
                        value={gaugesData.tayphai_đ}
                        minValue={-360}
                        maxValue={360}
                        unit="Độ"
                    />
                </div>
                <div>
                    <GaugeChart
                        label="CẲNG TAY TRÁI"
                        value={Math.abs(gaugesData.cangtaytrai_đ)}
                        minValue={-360}
                        maxValue={360}
                        unit="Độ"
                    />
                </div>
                <div>
                    <GaugeChart
                        label="CẲNG TAY PHẢI"
                        value={Math.abs(gaugesData.cangtayphai_đ)}
                        minValue={-360}
                        maxValue={360}
                        unit="Độ"
                    />
                </div>



            </div>
        </div>
    );
};

export default App;
