import React, { useState } from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import axios from 'axios';
import './UserLogin.css'; // Import file CSS tùy chỉnh

const initialSchema = {
  title: 'MỜI NHẬP TÀI KHOẢN',
  type: 'object',
  required: ['username', 'password', 'gender', 'height', 'weight', 'medicalHistory'],
  properties: {
    username: { type: 'string', title: 'TÊN BỆNH NHÂN' },
    password: { type: 'string', title: 'MÃ SỐ', format: 'password' },
    gender: { type: 'string', title: 'GIỚI TÍNH', enum: ['Nam', 'Nữ', 'Khác'] },
    height: { type: 'number', title: 'CHIỀU CAO (cm)' },
    weight: { type: 'number', title: 'CÂN NẶNG (kg)' },
    medicalHistory: { type: 'string', title: 'TIỀN SỬ BỆNH', format: 'textarea' },
  },
};

const UserLogin = () => {
  const [formDataTop, setFormDataTop] = useState({});
  const [formDataBottom, setFormDataBottom] = useState({});
  const [submitCount, setSubmitCount] = useState(0);
  const [showDeleteForm, setShowDeleteForm] = useState(false); // Trạng thái hiển thị form xóa

  const handleSubmitTop = async ({ formData }) => {
    try {
      console.log('Dữ liệu gửi đi:', formData);

      const response = await axios.post(
        'https://ap-southeast-1.aws.data.mongodb-api.com/app/data-tqlme/endpoint/POST_JSON_BACKEND',
        formData
      );

      console.log('Kết quả từ server:', response.data);
      alert('DỮ LIỆU ĐÃ ĐƯỢC LƯU LẠI CẢM ƠN  BẠN ĐÃ SỬ DỤNG');
      setFormDataTop({}); // Reset form sau khi submit thành công
      setSubmitCount(submitCount + 1);
    } catch (error) {
      console.error('Lỗi khi gửi dữ liệu:', error);
    }
  };

  const deleteFormSchema = {
    title: 'Xóa Tên Bệnh Nhân',
    type: 'object',
    required: ['usernameDelete'],
    properties: {
      usernameDelete: { type: 'string', title: 'TÊN BỆNH NHÂN CẦN XÓA' },
    },
  };

  const handleDeleteFormSubmit = async ({ formData }) => {
    try {
      console.log('Username cần xóa:', formData.usernameDelete);

      // Gửi yêu cầu xóa username lên server bằng axios
      const response = await axios.post(
        'https://ap-southeast-1.aws.data.mongodb-api.com/app/data-tqlme/endpoint/DELETE', formData
      );

      console.log('Kết quả từ server:', response.data);
      alert('TÊN BỆNH NHÂN ĐÃ ĐƯỢC XÓA. CẢM ƠN BẠN ĐÃ SỬ DỤNG');
      setFormDataBottom({}); // Reset form xóa sau khi submit thành công
      setSubmitCount(submitCount + 1);
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu xóa:', error);
    }
  };

  const toggleDeleteForm = () => {
    setShowDeleteForm(!showDeleteForm); // Đảo ngược trạng thái hiển thị form xóa khi nhấn nút
  };

  return (
    <div className="auth-form-container">
      <Form
        schema={initialSchema}
        validator={validator}
        formData={formDataTop}
        onChange={({ formData }) => setFormDataTop(formData)}
        onSubmit={handleSubmitTop}
      />
      <div className="auth-form-container">
        {showDeleteForm && (
          <Form
            schema={deleteFormSchema}
            validator={validator}
            formData={formDataBottom}
            onChange={({ formData }) => setFormDataBottom(formData)}
            onSubmit={handleDeleteFormSubmit}
          />
        )}
        <button onClick={toggleDeleteForm}>
          {showDeleteForm ? 'Ẩn Delete Form' : 'Hiện Delete Form'}
        </button>
      </div>
    </div>
  );
};

export default UserLogin;
