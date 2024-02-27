import React, { useEffect, useState } from 'react';
import { MongoClient } from 'mongodb';

const mongoURI = 'mongodb+srv://huyvo0188630:huyvo01886306462@cluster0.zimymg6.mongodb.net/?retryWrites=true&w=majority'; // Thay thế thông tin của bạn

const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const MongoDataFetcher = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await client.connect();
                console.log('Connected to MongoDB');

                const db = client.db('NodeRed_1'); // Thay thế 'mydatabase' bằng tên database của bạn
                const collection = db.collection('MONGODB'); // Thay thế 'mycollection' bằng tên collection của bạn

                const cursor = collection.find(); // Truy vấn tất cả dữ liệu từ collection

                const results = await cursor.toArray();
                setData(results);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

        return () => {
            client.close(); // Đóng kết nối khi component unmount
        };
    }, []);

    return (
        <div>
            <h1>MongoDB Data</h1>
            <ul>
                {data.map((item, index) => (
                    <li key={index}>{JSON.stringify(item)}</li>
                ))}
            </ul>
        </div>
    );
};

export default MongoDataFetcher;
