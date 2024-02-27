import React, { useState } from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import axios from 'axios';
import './UserLogin.css'; // Import file CSS tùy chỉnh

const simpleFormSchema = {
    title: 'NHẬP TÊN BỆNH NHÂN CẦN XÓA',
    type: 'object',
    required: ['username'],
    properties: {
        username: { type: 'string', title: 'TÊN BỆNH NHÂN' },
    },
};

const SimpleUserForm = () => {
    const [formData, setFormData] = useState({});
    const [submitCount, setSubmitCount] = useState(0);

    const handleSubmit = async ({ formData }) => {
        try {
            console.log('Username:', formData.username);

            // Gửi dữ liệu username lên server bằng axios
            const response = await axios.post(
                'https://example.com/api/submit-username',
                { username: formData.username }
            );

            console.log('Kết quả từ server:', response.data);
            alert('DỮ LIỆU ĐÃ ĐƯỢC LƯU LẠI. CẢM ƠN BẠN ĐÃ SỬ DỤNG');
            setFormData({}); // Reset form sau khi submit thành công
            setSubmitCount(submitCount + 1);
        } catch (error) {
            console.error('Lỗi khi gửi dữ liệu:', error);
        }
    };

    return (
        <div className="auth-form-container">
            <Form
                schema={simpleFormSchema}
                validator={validator}
                formData={formData}
                onChange={({ formData }) => setFormData(formData)}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default SimpleUserForm;
