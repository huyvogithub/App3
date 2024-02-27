import React, { useState } from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import axios from 'axios';
import './HandParamsForm.css'; // Import file CSS tùy chỉnh

const handParamsSchema = {
    title: 'NHẬP THÔNG SỐ TAY VÀ CẲNG TAY',
    type: 'object',
    required: ['taytrai', 'tayphai', 'cangtaytrai', 'cangtayphai'],
    properties: {
        taytrai: { type: 'number', title: 'TAY TRÁI (RAD)' },
        tayphai: { type: 'number', title: 'TAY PHẢI (RAD)' },
        cangtaytrai: { type: 'number', title: 'CẲNG TAY TRÁI (RAD)' },
        cangtayphai: { type: 'number', title: 'CẲNG TAY PHẢI (RAD)' },
    },
};

const HandParamsForm = () => {
    const [formData, setFormData] = useState({});

    const handleSubmit = async ({ formData }) => {
        try {
            console.log('Dữ liệu gửi đi:', formData);

            const response = await axios.post(
                'https://ap-southeast-1.aws.data.mongodb-api.com/app/data-tqlme/endpoint/UPMOTIONBACKEND',
                formData
            );

            console.log('Kết quả từ server:', response.data);
            alert('DỮ LIỆU VỊ TRÍ ĐÃ LƯU VUI LÒNG QUAN SÁT MÔ HÌNH MÔ PHỎNG 3D');
            // Reset form sau khi submit thành công
            setFormData({});
        } catch (error) {
            console.error('Lỗi khi gửi dữ liệu:', error);
        }
    };

    return (
        <div className="hand-params-form-container">
            <Form
                schema={handParamsSchema}
                validator={validator}
                formData={formData}
                onChange={({ formData }) => setFormData(formData)}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default HandParamsForm;
