import React from 'react';
import { Button, Card, Image } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';


export default function ActivityDetails() {
  const {activityStore} = useStore();
  const {selectedActivity: activity} = activityStore;

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
}