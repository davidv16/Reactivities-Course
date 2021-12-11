import React, { SyntheticEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Item, Label } from 'semantic-ui-react';
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
    <Item key={activity.id}>
      <Item.Content>
        <Item.Header as='a'>{activity.title}</Item.Header>
        <Item.Meta>{activity.date}</Item.Meta>
        <Item.Description>
          <div>{activity.description}</div>
          <div>{activity.city}, {activity.venue}</div>
        </Item.Description>
        <Item.Extra>
          <Button
            as={Link}
            to={`/activities/${activity.id}`}
            floated='right'
            content='View'
            color='blue' />
          <Button
            name={activity.id}
            loading={loading && target === activity.id}
            onClick={(e) => handleActivityDelete(e, activity.id)}
            floated='right'
            content='Delete'
            color='red'
          />
          <Label basic content={activity.category} />
        </Item.Extra>
      </Item.Content>
    </Item>

  )
}