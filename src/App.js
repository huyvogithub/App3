// App.js
import React, { useState } from 'react';
import './App.css';
import Form from './components/Form';
import UserList from './components/UserList';
import EmbeddedDashboard from './components/EmbeddedDashboard';
import SmallFrame from './components/SmallFrame';
import GaussianGraph from './components/GaussianGraph';
import Search from './components/Search';
import ThreeJSComponent from './components/ThreeJSComponent';
import MyImage from './components/logotdtu.png';
import TETS from './components/tets';
//import GET from './components/GET';
function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('form'); // Để xác định trang hiện tại

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClick = (page) => {
    setCurrentPage(page);
    setIsMenuOpen(false); // Đóng menu khi chọn một trang
  };
  return (
    <div className="App">

      <header>
        <div className="menu-icon" onClick={toggleMenu}>
          <div className="menu-line" />
          <div className="menu-line" />
          <div className="menu-line" />
          <div className="menu-line" />
        </div>
        <h1 className="app-title">A SIMULATION SYSTEM OF HUMAN MOTION - THE HAND PART</h1>
        <div className="image-container">
          <img src={MyImage} alt="Avatar" className="avatar-image" />
        </div>
      </header>
      <main>
        <div className={`form-container ${currentPage === 'form' ? 'visible' : 'hidden'}`}>
          <Form />


        </div>
        <div className={`user-list-container ${currentPage === 'userList' ? 'visible' : 'hidden'}`}>
          <Search />
          <UserList />
        </div>
        <div className={`chartmongo-container ${currentPage === 'userList2' ? 'visible' : 'hidden'}`}>
          <EmbeddedDashboard />


        </div>
        {currentPage === 'PAGE4' && (
          <div className="user-list-container">
            <TETS />
            <SmallFrame />

          </div>

        )}

      </main>
      <aside className={`side-menu ${isMenuOpen ? 'open' : ''}`}>
        <ul>
          <li onClick={() => handleMenuClick('form')}>NHẬP THÔNG TIN</li>
          <li onClick={() => handleMenuClick('userList')}>DANH SÁCH NGƯỜI DÙNG</li>
          <li onClick={() => handleMenuClick('userList2')}>BIỂU ĐỒ THÔNG SỐ THEO THỜI GIAN</li> {/* Thêm mục mới */}
          <li onClick={() => handleMenuClick('PAGE4')}>MÔ PHỎNG CHUYỂN ĐỘNG</li>
        </ul>
      </aside>
    </div>
  );
}

export default App;
