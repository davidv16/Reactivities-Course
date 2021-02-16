import React, { useEffect, useState } from 'react'
import { Container } from 'semantic-ui-react'
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';



function App() {
  //we access activityStore class from the custom react hook in store.ts
  const {activityStore} = useStore();
  
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

  //a hook to set the state of submitting on or off
  //args 1: variable boolean
  //args 2: the state
  const [submitting, setSubmitting] = useState(false);

  //a react hook that is used to change the state of the App component
  //renders when the app renders
  //call the api to get the activity list
  useEffect(() => {
    //call the activity store to load the dependencies from the api
    activityStore.loadingActivities();
    //then pass the activityStore as a dependency to our useEffect
  }, [activityStore])

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
    // to start the loading indicators
    setSubmitting(true);


    //EDIT/UPDATE 
    //if there exists an activity.id
    if(activity.id) {
      //run the update request to the api from axios
      agent.Activities.update(activity).then(() => {
        //filter out the activities that don't match the id passed
        //and set the activities to the new activity
        setActivities([...activities.filter(x => x.id !== activity.id), activity])
        //set the selected activity to the updated activity
        setSelectedActivity(activity);
        //set edit mode to false
        setEditMode(false);
        //and set submitting mode to false
        setSubmitting(false);
      })
    } else {

      //CREATE
      //generate a new uuid
      activity.id = uuid();
      //run the create request to the api from axios
      agent.Activities.create(activity).then(() => {
        //set the new activity to the activity array
        setActivities([...activities, activity])
        //set the selected activity to the new activity
        setSelectedActivity(activity);
        //set edit mode to false
        setEditMode(false);
        //and set submitting mode to false
        setSubmitting(false);
      })
    } 
  }

  //function to delete an activity
  function handleDeleteActivity(id: string) {
    setSubmitting(true);
    //run the delete request to the api from axios
    agent.Activities.delete(id).then(() => {
      console.log(...activities.filter(x => x.id !== id));
      //filter out all activities that don't match the passed id
      //and set the passed id to the activity that we want to delete
      setActivities([...activities.filter(x => x.id !== id)]);
      //turn submitting off
      setSubmitting(false);
    })
    //spreads out the activity items and filters everything out that isn't the id we pass in
    setActivities([...activities.filter(x => x.id !== id)])
  }
  //checks if the frontend is loading before it renders the Loading component
  if (activityStore.loadingInitial) return <LoadingComponent content='Loading app'/>

    return (
      <>
        <NavBar openForm={handleFormOpen} />
        <Container style={{marginTop: '7em'}}>
          <ActivityDashboard
            //props to send down the list of activities to the child components 
            activities={activityStore.activities}
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
            submitting={submitting}
             />
        </Container>
        
      </>
    );
}

export default observer(App);