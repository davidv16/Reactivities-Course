import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import ActivityList from './ActivityList';

export default observer (function ActivityDashboard() {
  //we access activityStore class from the custom react hook in store.ts
  const {activityStore} = useStore();
  //call our loadActivities function and use the activityRegistry as a property
  const{loadActivities, activityRegistry} = activityStore;

  //a react hook that is used to change the state of the App component
  //renders when the app renders
  //call the api to get the activity list
  useEffect(() => {
    //check if we have a loaded activitylist in the registry(state)
    //if not we load them.
    if(activityRegistry.size <= 1) loadActivities();
    //then pass the activityRegistry.size and loacActivities as a dependency to our useEffect
  }, [activityRegistry.size, loadActivities])


  //checks if the frontend is loading before it renders the Loading component
  if (activityStore.loadingInitial) return <LoadingComponent content='Loading app'/>

   
  return (
    <Grid>
      <Grid.Column width='10'>
        <ActivityList />
      </Grid.Column>
      <Grid.Column width='6'>
        <h2>activity filters</h2>
      </Grid.Column>
    </Grid>
  )
}
)