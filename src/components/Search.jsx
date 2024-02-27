// Import React và các thư viện khác
import React, { useState } from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import axios from 'axios';
import './Search.css'; // Import file CSS tùy chỉnh

// Khai báo schema khởi tạo
const initialSchema = {
    title: 'NHẬP TÊN CẦN TÌM',
    type: 'object',
    required: ['username'],
    properties: {
        username: { type: 'string', title: 'TÊN BỆNH NHÂN' },
    },
};

// Component chính
const UserLogin = () => {
    const [formData, setFormData] = useState({});
    const [submitCount, setSubmitCount] = useState(0);
    const [responseData, setResponseData] = useState(null);
    const [searchError, setSearchError] = useState(false);

    // Hàm xử lý khi form được submit
    const handleSubmit = async ({ formData }) => {
        try {
            // Gửi yêu cầu đến server bằng axios
            const response = await axios.post(
                'https://ap-southeast-1.aws.data.mongodb-api.com/app/data-tqlme/endpoint/SEARCH',
                formData
            );

            // Cập nhật state để hiển thị dữ liệu từ response.data
            setResponseData(response.data);

            if (Object.keys(response.data[0]?.public?.input?.jsonData || {}).length === 0) {
                setSearchError(true);
            } else {
                setSearchError(false);
                alert('ĐANG TÌM KIẾM VUI LÒNG NHẤN OKAY ĐỂ TIẾP TỤC');
            }

            setFormData({}); // Reset form sau khi submit thành công
            setSubmitCount(submitCount + 1);
        } catch (error) {
            console.error('Lỗi khi gửi dữ liệu:', error);
            setSearchError(true);
        }
    };

    return (
        <div className="auth-form-container">
            <h1 className="form-title">MỜI NHẬP TÊN BỆNH NHÂN CẦN TÌM </h1>
            <Form
                schema={initialSchema}
                validator={validator}
                formData={formData}
                onChange={({ formData }) => setFormData(formData)}
                onSubmit={handleSubmit}
            />

            {/* Hiển thị dữ liệu từ response.data hoặc thông báo khi không có dữ liệu */}
            {responseData && (
                <div>
                    {searchError ? (
                        <p>KHÔNG TÌM THẤY BỆNH NHÂN NÀO</p>
                    ) : (
                        <div>
                            <h2>DỮ LIỆU TÌM THẤY ĐƯỢC</h2>
                            <div className="grid-container">
                                {Object.keys(responseData[0].public.input.jsonData).map((username, index) => (
                                    <div key={index} className="grid-item">
                                        <h3>{username}</h3>
                                        <p><strong>Giới tính:</strong> {responseData[0].public.input.jsonData[username].gender}</p>
                                        <p><strong>Chiều cao:</strong> {responseData[0].public.input.jsonData[username].height}</p>
                                        <p><strong>Cân nặng:</strong> {responseData[0].public.input.jsonData[username].weight}</p>
                                        <p><strong>Bệnh sử:</strong> {responseData[0].public.input.jsonData[username].medicalHistory}</p>
                                        <p><strong>Mật khẩu:</strong> {responseData[0].public.input.jsonData[username].password}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserLogin;
