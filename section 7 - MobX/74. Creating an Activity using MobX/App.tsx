import React, { useEffect, useState } from 'react'
import { Container } from 'semantic-ui-react'
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
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
        <NavBar />
        <Container style={{marginTop: '7em'}}>
          <ActivityDashboard
            //props to send down the list of activities to the child components 
            activities={activityStore.activities}
            deleteActivity={handleDeleteActivity}
            submitting={submitting}
             />
        </Container>
        
      </>
    );
}

export default observer(App);