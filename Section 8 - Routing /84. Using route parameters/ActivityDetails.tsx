import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card, Image } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';


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
    <Card fluid>
      <Image src={`/assets/categoryImages/${activity.category}.jpg`} />
      <Card.Content>
        <Card.Header>{activity.title}</Card.Header>
        <Card.Meta>
          <span>{activity.date}</span>
        </Card.Meta>
        <Card.Description>
          {activity.description}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group>
          <Button basic color='blue' content='Edit' />
          <Button basic color='grey' content='Cancel'/>
        </Button.Group>
      </Card.Content>
    </Card>
  )
})