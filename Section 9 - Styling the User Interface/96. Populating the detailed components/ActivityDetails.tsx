import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Card, Grid, Image } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import ActivityDetailedChat from './ActivityDetailedChat';
import ActivityDetailedHeader from './ActivityDetailedHeader';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import ActivityDetailedSidebar from './ActivityDetailedSidebar';


export default observer (function ActivityDetails() {
  const {activityStore} = useStore();
  const {selectedActivity: activity, loadActivity} = activityStore;
  const {id} = useParams<{id: string}>();

  useEffect(() => {
    //check if id from url parameters exists
    //load a single activity with the id from the url
    if(id) loadActivity(id);
    //set the url id and loadActivity function as a dependency
  }, [id, loadActivity])

  if(!activity) return <LoadingComponent/>;

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailedHeader activity={activity}/>
        <ActivityDetailedInfo activity={activity} />
        <ActivityDetailedChat/>
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailedSidebar/>
      </Grid.Column>
    </Grid>
  )
})