import { observer } from 'mobx-react-lite';
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { Button, Form, Segment } from 'semantic-ui-react'
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import { v4 as uuid } from 'uuid';


export default observer(function ActivityForm() {
  //a hook from the react router dom
  const history = useHistory();
  //access the activity store
  const {activityStore} = useStore();
  //destructure the activitystore
  const {createActivity, updateActivity, 
    loading, loadActivity, loadingInitial} = activityStore;
  //the id from the url from the single activity
  const {id} = useParams<{id: string}>();

  //set the local state activity item's to empty strings.
  const [activity, setActivity] = useState({
    id: '',
    title: '',
    category: '',
    description: '',
    date: '',
    city: '',
    venue: ''
  });

  //a react hook that is used to change the state of the Activity Form component
  //renders when the component renders
  //calls the api to get a single activity from the url and sets the local state to current activity
  useEffect(() => {
    //if an id exists in the url then call the load activity from activityStore
    //then when axios responds take the activity and store it to the local state
    if (id) loadActivity(id).then(activity => setActivity(activity!))
    //set the id and loadActivity function as a dependency
  }, [id, loadActivity])


  function handleSubmit() {
    //if the current state activity doesn't exist
    if(activity.id.length === 0) {
      //then set the new activity a new uuid
      let newActivity = {
        ...activity,
        id: uuid()
      };
      //then run the createActivity to the api
      //and push the response from the api to the url
      createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`))
    } else {
      //otherwise if there is an activity in the state then run the update activity and 
      //push the activity id from the api response to the url
      updateActivity(activity).then(() => history.push(`/activities/${activity.id}`))
    }
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

  if (loadingInitial) return <LoadingComponent content='Loading activity...'/>
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