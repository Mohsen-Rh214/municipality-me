import React from 'react';
import { getToken } from './utils/SessionStorage';
import moment from "moment-jalaali"
import { DrawerProvider } from './utils/drawerContext';

// theme
import { ThemeProvider } from '@mui/material/styles'
import theme from './configs/theme';

// Routes
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/login/Login';
import Panel from './components/layout/Panel';
import NoMatch from './pages/no-match/NoMatch';

import Home from './pages/home/Home';

import PersonalInfo from './pages/personal-info/Index';
import AddPerson from './pages/personal-info/AddPerson';
import EditPerson from './pages/personal-info/EditPerson';

import Contracts from './pages/contracts/Index';
import AddContract from './pages/contracts/AddContract';
import EditContract from './pages/contracts/EditContract';

import Unit from './pages/unit/Index';
import AddUnit from './pages/unit/AddUnit';
import EditUnit from './pages/unit/EditUnit';

import Buildings from './pages/buildings/Index';
import AddBuilding from './pages/buildings/AddBuilding';
import EditBuilding from './pages/buildings/EditBuilding';

import Ground from './pages/ground/Index';
import AddGround from './pages/ground/AddGround';
import EditGround from './pages/ground/EditGround';


// import NoMatch from './pages/no-match';

const PrivateRoute = ({ children }) => {
  const token = getToken('token')
  if (!token) {
    return <Navigate to='/' />
  }
  return children
}

function App() {

  // persian digits for moment in global use 
  moment.loadPersian({ usePersianDigits: true })

  return (
    <ThemeProvider theme={theme}>
      <DrawerProvider>
        <Router>
          <Routes>

            <Route index element={<Login />} />

            {/* context api, keeps drawer open state, for address field in forms */}
            <Route
              path='/panel/*'
              element={
                <PrivateRoute>
                  <Panel />
                </PrivateRoute>
              }>


              {/* <Route index element={<Home />} /> */}
              <Route index element={<NoMatch />} />


              <Route path='personal-info' element={<PersonalInfo />} />
              <Route path='add-person' element={<AddPerson />} />
              <Route path='edit-person/:personId' element={<EditPerson />} />


              {/* -- > -- > Grounds Info < -- < -- */}
              <Route path='ground-info' element={<Ground />} />
              <Route path='add-ground' element={<AddGround />} />
              <Route path='edit-ground/:groundId' element={<EditGround />} />


              {/* -- > -- > Building Info < -- < -- */}
              <Route path='building-info' element={<Buildings />} />
              <Route path='add-building' element={<AddBuilding />} />
              <Route path='edit-building/:buildingId' element={<EditBuilding />} />


              {/* -- > -- > Unit Info < -- < -- */}
              <Route path='unit-info' element={<Unit />} />
              <Route path='add-unit' element={<AddUnit />} />
              <Route path='edit-unit/:unitId' element={<EditUnit />} />

              {/* -- > -- > Contracts Info < -- < -- */}
              <Route path='contracts' element={<Contracts />} />
              <Route path='add-contract' element={<AddContract />} />
              <Route path='edit-contract/:contractId' element={<EditContract />} />


              {/* -- >> Not Found 404 */}
              <Route path='*' element={<NoMatch />} />
            </Route>
          </Routes>
        </Router>
      </DrawerProvider>
    </ThemeProvider>
  );
}

export default App;