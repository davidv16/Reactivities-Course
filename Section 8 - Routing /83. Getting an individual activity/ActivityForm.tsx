import { observer } from 'mobx-react-lite';
import React, { ChangeEvent, useState } from 'react'
import { Button, Form, Segment } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store';


export default observer(function ActivityForm() {
  //access the activity store
  const {activityStore} = useStore();
  //destructure the activitystore
  const {selectedActivity, createActivity, updateActivity, loading} = activityStore;

  // a variable for the initial state
  // if there isn't an activity in the state
  // then set the activity item's to empty strings.
  const initialState = selectedActivity ?? {
    id: '',
    title: '',
    category: '',
    description: '',
    date: '',
    city: '',
    venue: ''
  };

  const [activity, setActivity] = useState(initialState);

  function handleSubmit() {
    activity.id ? updateActivity(activity) : createActivity(activity);
  }

  //function to handle text input
  //args: takes in an event of the input and of the type HTMLInputElement or TextAreaElement
  function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    
    //set the target being written in to name and value to be mapped into the activity object
    const {name, value} = event.target;
    
    //with a spread operator we can spread the existing properties of the activity
    //then target the property with the key of name 
    //and that should be set to whatever the value is inside the input element in the form
    setActivity({...activity, [name]: value})
  }

  return (
    <Segment>
      <Form onSubmit={handleSubmit} autoComplete='off'>
        <Form.Input placeholder='Title' value={activity.title} name='title' onChange={handleInputChange}/>
        <Form.TextArea placeholder='Description' value={activity.description} name='description' onChange={handleInputChange}/>
        <Form.Input placeholder='Category' value={activity.category} name='category' onChange={handleInputChange}/>
        <Form.Input type='date' placeholder='Date' value={activity.date} name='date' onChange={handleInputChange}/>
        <Form.Input placeholder='City' value={activity.city} name='city' onChange={handleInputChange}/>
        <Form.Input placeholder='Venue' value={activity.venue} name='venue' onChange={handleInputChange}/>
        <Button loading={loading} floated='right' positive type='submit' content='Submit' />
        <Button floated='right' type='button' content='Cancel' />
      </Form>
    </Segment>
  )
}
)