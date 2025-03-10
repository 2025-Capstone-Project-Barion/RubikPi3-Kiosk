import React from 'react';
import '../styles/Front/front.css';

const Front = () => {
    return (
        <div className="container">
            <div className="welcome-text">
                어서오세요.
            </div>
            <div className="order-text">
                여기에서 주문할 수 있어요!
            </div>
            <div className="performance-text">
                배리어프리 키오스크 플렛폼<br />
                Barion입니다.
            </div>
        </div>
    );
}

export default Front;