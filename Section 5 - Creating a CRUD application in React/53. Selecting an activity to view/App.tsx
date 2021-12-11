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

  //a hook to set selected Activity to a varialbe
  //args 1: selected Activity variable that keeps the state Activity with id or is undefined
  //args 2: the state
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);

  //a react hook that is used to change the state of the App component
  useEffect(() => {
    axios.get<Activity[]>('http://localhost:5051/api/activities')
      .then((response) => {
        setActivities(response.data);
      })
  }, [])

  //a function that takes in the id of the selected activity
  //and finds it in the list
  function handleSelectActivity(id: string) {
    //gets the activities array
    //looks for an id in the list that matches the id we pass in as a parameter
    setSelectedActivity(activities.find(x => x.id === id));
  }

  //Sets the Selected activity variable back to undefined
  function handleCancelSelectActivity() {
    setSelectedActivity(undefined);
  }

    return (
      <>
        <NavBar/>
        <Container style={{marginTop: '7em'}}>
          <ActivityDashboard
            //props to send down the list of activities to the child components 
            activities={activities}
            //props to send down the selected activity
            selectedActivity={selectedActivity}
            //props to send down the handleSelectActivity function
            selectActivity={handleSelectActivity}
            //props to send down the cancelSelectActivity function
            cancelSelectActivity={handleCancelSelectActivity}
             />
        </Container>
        
      </>
    );
}

export default App;