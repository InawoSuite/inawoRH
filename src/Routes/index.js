import React from 'react';
import { Routes, Route, Outlet } from "react-router-dom";
import NonAuthLayout from "../Layouts/NonAuthLayout";
import VerticalLayout from "../Layouts/index";
import { authProtectedRoutes, publicRoutes } from "./allRoutes";
import { AuthProtected } from './AuthProtected';

const Index = () => {
    return (
        <>
            <Routes>
                {publicRoutes.map((route, idx) => (
                    <Route
                        path={route.path}
                        element={
                            <NonAuthLayout>
                                {route.component}
                            </NonAuthLayout>
                        }
                        key={idx}
                    />
                ))}
                
                {authProtectedRoutes.map((route, idx) => (
                    <Route
                        path={route.path}
                        element={
                            <AuthProtected>
                                <VerticalLayout>{route.component}</VerticalLayout>
                            </AuthProtected>
                        }
                        key={idx}
                    />
                ))}
                
                {/* Route pour ExpenseCreateRouter */}
                <Route path="/depenses/create/:type" element={<VerticalLayout><Outlet /></VerticalLayout>} />
            </Routes>
        </>
    );
};

export default Index;

