import React, { useEffect, useState } from 'react'
import { Container } from 'semantic-ui-react'
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';



function App() {
  //useState is a react hook
  //we set the state to activities
  //and provide the hook with a function that is used to set the state "setActivities"
  const [activities, setActivities] = useState<Activity[]>([]);

  //a hook to set selected Activity to a varialbe
  //args 1: selected Activity variable that keeps the state Activity with id or is undefined
  //args 2: the state
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);

  //a hook to set the set state of editMode on or off
  //args 1: variable boolean
  //args 2: the state
  const [editMode, setEditMode] = useState(false);

  //a hook to set the state of loading on or off
  //args 1: variable boolean
  //args 2: the state
  const [loading, setLoading] = useState(true);

  //a react hook that is used to change the state of the App component
  useEffect(() => {
    //sends the axios get request specified in agent.ts
    agent.Activities.list().then(response => {
      //empty seperate activities array of type activity array
      let activities: Activity[] = [];
      //from the response, for each activity
      response.forEach(activity => {
        //each date from the activity should be split the text based on the T character
        //and we'll take the first part of what we split into
        //will return a numbered date and not the time information
        activity.date = activity.date.split('T')[0];
        //and we'll push our activity into the activities array above
        activities.push(activity);
      })
        setActivities(activities);
        setLoading(false);
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

  //a function to handle the form edit
  //args: optional id
  function handleFormOpen(id?: string) {
    //if there is an id
    // run the handleSelectActivity select the Activity with the id
    // else cancel the select activity
    id ? handleSelectActivity(id) : handleCancelSelectActivity();
    //and set the edit mode of the form to true
    setEditMode(true);
  }

  //function to set the edit mode to false on form close
  function handleFormClose() {
    setEditMode(false);
  }

  //function to create or edit activity
  function handleCreateOrEditActivity (activity: Activity) {
    //check if an activity exists
    //then use the spread operator to loop over existing activities
    //if x goes to x.id is not equal to the activity id we passed in
    //then after the comma we pass in the new or newly updated activity.
    activity.id ? setActivities([...activities.filter(x => x.id !== activity.id), activity])
    //else if we do not have an activity then we create a new one and pass in a uuid to create a new one.
    : setActivities([...activities, {...activity, id: uuid()}]);
    
    //turn off editMode
    setEditMode(false);

    //set the selected activity to the id we just created
    setSelectedActivity(activity);
  }

  //function to delete an activity
  function handleDeleteActivity(id: string) {
    //spreads out the activity items and filters everything out that isn't the id we pass in
    setActivities([...activities.filter(x => x.id !== id)])
  }
  //checks if the frontend is loading before it renders the Loading component
  if (loading) return <LoadingComponent content='Loading app'/>

    return (
      <>
        <NavBar openForm={handleFormOpen} />
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
            editMode={editMode}
            openForm={handleFormOpen}
            closeForm={handleFormClose}
            createOrEdit={handleCreateOrEditActivity}
            deleteActivity={handleDeleteActivity}
             />
        </Container>
        
      </>
    );
}

export default App;