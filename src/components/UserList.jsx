import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MyImage from './benhnhan.jpg';
const UserList = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [hoveredUser, setHoveredUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState({});
  const fetchData = async () => {
    try {
      const response = await axios.get('https://ap-southeast-1.aws.data.mongodb-api.com/app/data-tqlme/endpoint/GET');
      setUserData(response.data.input.jsonData);
      setAdditionalInfo(response.data.output.jsonData);
      setError(null);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau nha.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchData();
  };

  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleUserClick = (username) => {
    setSelectedUser(username);
  };

  const handleBack = () => {
    setSelectedUser(null);
  };

  const handleUserHover = (username) => {
    setHoveredUser(username);
  };

  const handleUserLeave = () => {
    setHoveredUser(null);
  };

  const handleSearch = () => {
    if (!searchTerm) {
      alert('Vui lòng nhập tên bệnh nhân bạn muốn tìm');
      return;
    }

    const results = Object.keys(userData).filter(username =>
      userData[username]?.username && userData[username]?.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
    setSearching(true);
  };

  const handleCancelSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setSearching(false);
  };

  return (
    <div style={{ fontFamily: 'Times New Roman' }}>
      <h2 style={{ fontSize: '2em', fontWeight: 'bold', fontFamily: 'Times New Roman' }}>DANH SÁCH NGƯỜI DÙNG</h2>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên người dùng"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            marginRight: '10px',
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            outline: 'none',
            transition: 'all 0.3s ease',
          }}
        />
        <button onClick={handleSearch}>Tìm kiếm</button>
        {searching && <button onClick={handleCancelSearch} style={{ marginLeft: '10px', marginRight: '10px' }}>Hủy tìm kiếm</button>}
        <button onClick={handleRefresh} style={{ marginLeft: '10px', marginRight: '10px' }} disabled={loading}>
          {loading ? 'Đang làm mới...' : 'Làm mới'}
        </button>
        <button onClick={toggleShowPassword} style={{ marginLeft: '10px' }}>
          {showPassword ? 'Ẩn' : 'Hiện'} Mật khẩu
        </button>
      </div>
      {error && <p style={{ color: 'red', fontSize: '1.2em', fontWeight: 'bold', fontFamily: 'Times New Roman' }}>{error}</p>}
      {selectedUser ? (
        <div style={{ border: '2px solid black', padding: '20px', marginBottom: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '200px', height: '200px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src={MyImage} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <p><strong style={{ fontSize: '1.3em', fontWeight: 'bold', fontFamily: 'Times New Roman' }}>Tên bệnh nhân:</strong> {userData[selectedUser]?.username}</p>
            <p><strong style={{ fontSize: '1.3em', fontWeight: 'bold', fontFamily: 'Times New Roman' }}>Giới tính:</strong> {userData[selectedUser]?.gender}</p>
            <p><strong style={{ fontSize: '1.3em', fontWeight: 'bold', fontFamily: 'Times New Roman' }}>Chiều cao:</strong> {userData[selectedUser]?.height}</p>
            <p><strong style={{ fontSize: '1.3em', fontWeight: 'bold', fontFamily: 'Times New Roman' }}>Cân nặng:</strong> {userData[selectedUser]?.weight}</p>
            <p><strong style={{ fontSize: '1.3em', fontWeight: 'bold', fontFamily: 'Times New Roman' }}>Lịch sử bệnh:</strong> {userData[selectedUser]?.medicalHistory}</p>
            <p><strong style={{ fontSize: '1.3em', fontWeight: 'bold', fontFamily: 'Times New Roman' }}>Chỉ số BMI:</strong> {additionalInfo[selectedUser]?.BMI}</p>
            {showPassword && <p><strong style={{ fontSize: '1.3em', fontWeight: 'bold', fontFamily: 'Times New Roman' }}>Mật khẩu:</strong> {userData[selectedUser]?.password}</p>}
            <button onClick={handleBack} style={{ fontSize: '1.3em', fontWeight: 'bold', fontFamily: 'Times New Roman' }}>Quay lại</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginTop: '10px' }}>
          {searching ? (
            searchResults.map((username, index) => (
              <div
                key={username}
                style={{
                  border: '1px solid black',
                  padding: '10px',
                  cursor: 'pointer',
                  transform: hoveredUser === username ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
                onClick={() => handleUserClick(username)}
                onMouseEnter={() => handleUserHover(username)}
                onMouseLeave={handleUserLeave}
              >
                <div style={{ width: '200px', height: '200px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <img src={MyImage} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <p style={{ fontSize: '1.5em', fontWeight: 'bold', fontFamily: 'Times New Roman', marginTop: '10px' }}>Bệnh nhân số: {index + 1}</p>
                <p><strong style={{ fontSize: '1.2em', fontWeight: 'bold', fontFamily: 'Times New Roman' }}>Tên bệnh nhân:</strong> {userData[username]?.username}</p>
              </div>
            ))
          ) : (
            Object.keys(userData).map((username, index) => (
              <div
                key={username}
                style={{
                  border: '1px solid black',
                  padding: '10px',
                  cursor: 'pointer',
                  transform: hoveredUser === username ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
                onClick={() => handleUserClick(username)}
                onMouseEnter={() => handleUserHover(username)}
                onMouseLeave={handleUserLeave}
              >
                <div style={{ width: '200px', height: '200px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <img src={MyImage} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <p style={{ fontSize: '1.5em', fontWeight: 'bold', fontFamily: 'Times New Roman', marginTop: '10px' }}>Bệnh nhân số: {index + 1}</p>
                <p><strong style={{ fontSize: '1.2em', fontWeight: 'bold', fontFamily: 'Times New Roman' }}>Tên bệnh nhân :</strong> {userData[username]?.username}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default UserList;
