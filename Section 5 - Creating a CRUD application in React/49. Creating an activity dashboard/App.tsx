import React, { Fragment, useEffect, useState } from 'react'
import { Container, Header, List } from 'semantic-ui-react'
import axios from 'axios'
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';



function App() {
  //useState is a react hook
  //we set the state to activities
  //and provide the hook with a function that is used to set the state "setActivities"
  const [activities, setActivities] = useState<Activity[]>([]);

  //a react hook that is used to change the state of the App component
  useEffect(() => {
    axios.get<Activity[]>('http://localhost:5051/api/activities')
      .then((response) => {
        setActivities(response.data);
      })
  }, [])

    return (
      <>
        <NavBar/>
        <Container style={{marginTop: '7em'}}>
          <ActivityDashboard activities={activities} />
        </Container>
        
      </>
    );
}

export default App;