import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom';
import React from 'react';
import ReactDOM from "react-dom";


ReactDOM.render(
<BrowserRouter>
<App />
</BrowserRouter>,
document.getElementById("root")
);
