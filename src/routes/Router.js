import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Front from '../pages/Front';

const Router = () => {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Front />} />
                {/* <Route path="/menu" component={Menu} />
                <Route path="/payment" component={Payment} /> */}
            </Routes>
        </HashRouter>
    );
}

export default Router;