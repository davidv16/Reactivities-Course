import React, { SyntheticEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, Item, Label, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import { useStore } from '../../../app/stores/store';

interface Props {
  activity: Activity
}

export default function ActivityListItem({activity}: Props) {
  //brings in the activityStore from mobx
  const {activityStore} = useStore();
  //access the deleteActivity function and loading property
  const {deleteActivity, loading} = activityStore;
  
  //brings in the clicked target from the state
  const [target, setTarget] = useState('');

  //a function that handles delete of an activity and the loading icon on delete
  //args1: takes in an event of any
  //args2; the id
  function handleActivityDelete(e: SyntheticEvent<HTMLButtonElement>, id: string) {
    //sets the target to the name of the event clicked
    setTarget(e.currentTarget.name);
    //and runs the deleteActivity.
    deleteActivity(id);
  }

  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Image size='tiny' circular src='/assets/user.png' />
            <Item.Content>
              <Item.Header as={Link} to={`/activities/${activity.id}`} >{activity.title}</Item.Header>
            </Item.Content> 
            <Item.Description>Hosted by Bob</Item.Description>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <span>
          <Icon name='clock' /> {activity.date}
          <Icon name='marker' /> {activity.venue}
        </span>
      </Segment>
      <Segment secondary>
        Attendees go here
      </Segment>
      <Segment clearing>
        <span>{activity.description}</span>
        <Button 
          as={Link}
          to={`/activities/${activity.id}`}
          color='teal'
          floated='right'
          content='View'
        />
      </Segment>
    </Segment.Group>
  )
}