// src/App.jsx
import { ThemeProvider } from "./components/themeprovider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../src/components/layout/Layout";

import { RouteAbout, RouteBlog, RouteBlogAdd,RouteBlogEdit,RouteIndex, RouteInternship, RouteOpportunity, RouteProfile, RouteSignIn, RouteSignUp } from "./helpers/RouteName";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Index from "./pages/Index";
import Profile from "./pages/Profile"
import Addblog from "./pages/Addblog"
import BlogDetails from "./pages/BlogDetails";
import EditBlog from './pages/EditBlog'
import Opportunities from "./pages/Opportunities";
import Interviews from "./pages/Interview";
import InterviewDetails from "./pages/InterviewDetails";
import About from "./pages/About";
import ScrollToTop from "@/components/Layout/ScrollTop"
import AuthRouteProtection from "./components/AuthRouteProtection";

const App = () => (
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <BrowserRouter>
    <ScrollToTop /> 
      <Routes>
        <Route element={<Layout />}>
          <Route path={RouteIndex} element={<Index />} />
         
          
         
          
          <Route path={RouteBlogEdit()} element={<EditBlog/>} />
          <Route path={RouteOpportunity} element={<Opportunities/>} />
          <Route path={RouteInternship} element={<Interviews/>} />
         
          <Route path= {RouteAbout} element={<About/>}/>

          <Route element={<AuthRouteProtection/>}>
               <Route path={RouteProfile} element={<Profile />} />
                <Route path={RouteBlogAdd} element={<Addblog />} />
                <Route path={RouteBlog} element={<BlogDetails/>} />
                  <Route path="/interviews/:id" element={<InterviewDetails />} />
          </Route>
        </Route>

        <Route path={RouteSignIn} element={<SignIn/>}/>
        <Route path={RouteSignUp} element={<SignUp/>}/>
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
