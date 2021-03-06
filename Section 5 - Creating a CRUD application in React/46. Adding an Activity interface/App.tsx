import React, { useEffect, useState } from 'react'
import { Header, List } from 'semantic-ui-react'
import axios from 'axios'
import { Activity } from '../models/activity';



function App() {
  //useState is a react hook
  //we set the state to activities
  //and provide the hook with a function that is used to set the state "setActivities"
  const [activities, setActivities] = useState<Activity[]>([]);

  //a react hook that is used to change the state of the App component
  useEffect(() => {
    axios.get<Activity[]>('http://localhost:5051/api/activities')
      .then((response) => {
        setActivities(response.data);
      })
  }, [])

    return (
      <div>
        <Header as='h2' icon="users" content="Reactivities" />
        
        <List>
        {activities.map(activity => (
          <List.Item key={activity.id}>
            {activity.title}
          </List.Item>
          ))}
        </List>
      </div>
    );
}

export default App;