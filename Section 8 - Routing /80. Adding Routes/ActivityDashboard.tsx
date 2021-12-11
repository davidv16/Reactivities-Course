import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
import ActivityList from './ActivityList';

export default observer (function ActivityDashboard() {
  //we access activityStore class from the custom react hook in store.ts
  const {activityStore} = useStore();
  const {selectedActivity, editMode} = activityStore;

  //a react hook that is used to change the state of the App component
  //renders when the app renders
  //call the api to get the activity list
  useEffect(() => {
    //call the activity store to load the dependencies from the api
    activityStore.loadingActivities();
    //then pass the activityStore as a dependency to our useEffect
  }, [activityStore])


  //checks if the frontend is loading before it renders the Loading component
  if (activityStore.loadingInitial) return <LoadingComponent content='Loading app'/>

   
  return (
    <Grid>
      <Grid.Column width='10'>
        <ActivityList />
      </Grid.Column>
      <Grid.Column width='6'>
        {selectedActivity && !editMode &&
          <ActivityDetails />}
        {editMode &&
          <ActivityForm />}
      </Grid.Column>
    </Grid>
  )
}
)